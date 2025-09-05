import cv2
import time
import numpy as np
from yoloDet import YoloTRT
from paddleocr import PaddleOCR
import logging

# =========================
# Konfigurasi mode OCR
# =========================
USE_GPU = True            # True = pakai GPU
USE_TRT = False           # True = pakai TensorRT (hanya jika USE_GPU=True)
GPU_MEM = 800             # GPU memory MB
PRECISION = 'fp16'        # fp16 lebih cepat di Jetson, fp32 default

# =========================
# Inisialisasi PaddleOCR
# =========================
ocr = PaddleOCR(
    use_gpu=USE_GPU,
    use_tensorrt=USE_TRT,
    precision=PRECISION,
    gpu_mem=GPU_MEM,
    use_angle_cls=False
)

# Matikan log PaddleOCR
logger = logging.getLogger("ppocr")
logger.setLevel(logging.ERROR)

# =========================
# Inisialisasi YOLO-TensorRT
# =========================
model = YoloTRT(
    library="/home/jetsonxaviernx/Documents/platify_dev/yolov5/build/libmyplugins.so",
    engine="yolov5_plat.engine",
    conf=0.8,
    yolo_ver="v5"
)

# =========================
# Fungsi validasi plat nomor
# =========================
def convert_numeric_to_alpha(s):
    conversion_map = {'0': 'O', '1': 'I', '2': 'Z', '3': 'B', '4': 'A', '5': 'S', '6': 'G', '7': 'Z', '8': 'B', '9': 'G'}
    return ''.join(conversion_map.get(char, char) for char in s)

def validate_license_plate(plate):
    valid_regions = {'B', 'A', 'AA', 'AD', 'K', 'R', 'G', 'H', 'AG', 'AE', 'L', 'M', 'N', 'S', 'W', 'P', 'AB', 
                     'KU', 'KT', 'KH', 'KB', 'DA', 'BA', 'BD', 'BB', 'BE', 'BG', 'BH', 'BK', 'BL', 'BM', 'BN', 
                     'BP', 'D', 'F', 'E', 'Z', 'T', 'DC', 'DD', 'DN', 'DT', 'DL', 'DM', 'DB', 'DK', 'ED', 'EA', 
                     'EB', 'DH', 'DR', 'DE', 'DG', 'PA', 'PB'}
    if plate[:2] in valid_regions:
        region = plate[:2]
        rest = plate[2:]
    elif plate[0] in valid_regions:
        region = plate[0]
        rest = plate[1:]
    else:
        return False, "Invalid region"

    num_part = ""
    for i in range(4, 0, -1):
        if rest[:i].isdigit():
            num_part = rest[:i]
            rest = rest[i:]
            break
    if not num_part:
        return False, "Invalid numeric part"

    rest = rest.strip()
    rest = convert_numeric_to_alpha(rest)
    if rest.endswith("I"):
        rest = rest[:-1]
    if len(rest) <= 3 and rest.isalpha():
        letter_part = rest
    else:
        return False, "Invalid letter part"

    return True, (region, num_part, letter_part)

# =========================
# Video capture & GUI
# =========================
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

while True:
    start_time = time.time()
    ret, frame = cap.read()
    if not ret:
        continue

    # =========================
    # YOLO Detection
    # =========================
    detections, _ = model.Inference(frame)

    for detection in detections:
        x1, y1, x2, y2 = map(int, detection['box'])
        confidence = detection['conf']
        if confidence < 0.8:
            continue

        width = x2 - x1
        height = y2 - y1
        new_height = int(height * 0.7)
        new_width = int(width * 0.99)
        x1_new = x1 + (width - new_width) // 2
        y2_new = y1 + new_height
        x2_new = x1 + new_width

        if x1 >= x2 or y1 >= y2:
            continue

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

        # Crop ROI
        crop = frame[y1:y2_new, x1_new:x2_new]
        if crop.size == 0:
            continue

        gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_OTSU | cv2.THRESH_BINARY)
        white_pixels = np.sum(thresh == 255)
        roi = thresh if white_pixels > thresh.size * 0.5 else cv2.bitwise_not(thresh)

        # =========================
        # PaddleOCR inference
        # =========================
        results = ocr.ocr(roi)
        if results is None:
            continue

        for res in results:
            hsl = []
            for line in res:
                plate_number = line[1][0]
                hsl.append(plate_number)
            plat = "".join(hsl).replace("\n", "").replace(" ", "")
            if plat.startswith("I") or plat.startswith("1"):
                plat = plat[1:]
            if plat:
                valid, result = validate_license_plate(plat)
                if valid:
                    print("Plat valid:", result[0], result[1], result[2])
                else:
                    print("Plat invalid:", plat)

    # =========================
    # FPS & display
    # =========================
    fps = 1.0 / (time.time() - start_time)
    cv2.putText(frame, f"FPS: {fps:.2f}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    frame_resized = cv2.resize(frame, (640, 480))
    cv2.imshow("Frame", frame_resized)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

