"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// tipe data kendaraan
type Kendaraan = {
  Pemilik: string;
  jenisB: string;
  jenisK: string;
  kuotaH: number;
  merekK: string;
  platN: string;
  sisaK: number;
  tahunR: number;
  warnaK: string;
};

export default function Home() {
  const [plat, setPlat] = useState("...");
  const [nominal, setNominal] = useState(0);
  const [dataKendaraan, setDataKendaraan] = useState<Kendaraan | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [hargaBBM, setHargaBBM] = useState<Record<string, number>>({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // popup konfirmasi
  const [loading, setLoading] = useState(false);

  const handleAddNominal = (digit: number | "000") => {
    setNominal((prev) => {
      if (digit === "000") {
        return prev === 0 ? 0 : prev * 1000;
      }
      return prev * 10 + digit;
    });
  };

  const handleClear = () => {
    setNominal(0);
  };

  const handleCheckAndOpenConfirm = () => {
    // ✅ Pengecekan sebelum pop up
    if (!dataKendaraan) {
      toast.error("Data kendaraan belum ada!");
      return;
    }

    if (!hargaBBM[dataKendaraan.jenisB]) {
      toast.error("Harga BBM belum tersedia!");
      return;
    }

    if (nominal === 0) {
      toast.error("Nominal belum diinputkan!");
      return;
    }

    // ✅ Kalau valid, baru buka popup konfirmasi
    setShowConfirm(true);
  };

  const handleSubmit = async () => {
    if (!dataKendaraan) {
      toast.error("Data kendaraan belum ada!");
      return;
    }
    if (!hargaBBM[dataKendaraan.jenisB]) {
      toast.error("Harga BBM belum tersedia!");
      return;
    }

    setLoading(true);
    try {
      const jenisBBM = dataKendaraan.jenisB;
      const harga = hargaBBM[jenisBBM];
      const liter = Number((nominal / harga).toFixed(2));

      const now = new Date();
      const dd = String(now.getDate()).padStart(2, "0");
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const yy = String(now.getFullYear()).toString().slice(-2);
      const tanggalStr = `${dd}${mm}${yy}`;

      const spbuId = "SPBU1";
      const platClean = plat.replace(/\s+/g, "").toUpperCase();
      const jenisCode = jenisBBM.startsWith("P") ? "P" : "S";
      const prefixId = `${spbuId}${platClean}${tanggalStr}${jenisCode}`;

      const res = await fetch(
        `https://platif-ai-default-rtdb.asia-southeast1.firebasedatabase.app/rwytSPBU1/SubsidiPump1/${jenisBBM}.json`
      );
      const existing = await res.json();

      let count = 1;
      if (existing) {
        const filtered = Object.keys(existing).filter((key) =>
          key.startsWith(prefixId)
        );
        count = filtered.length + 1;
      }

      const idPembelian = `${prefixId}${count}`;

      const waktuStr = `${now.getFullYear()}-${mm}-${dd} ${String(
        now.getHours()
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(
        2,
        "0"
      )}:${String(now.getSeconds()).padStart(2, "0")}`;

      const data = {
        plat,
        jenisBBM,
        liter,
        nominal,
        waktu: waktuStr,
        idPembelian,
      };

      await fetch(
        `https://platif-ai-default-rtdb.asia-southeast1.firebasedatabase.app/rwytSPBU1/SubsidiPump1/${jenisBBM}/${idPembelian}.json`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const newSisa = Math.max(
        0,
        Number((dataKendaraan.sisaK - liter).toFixed(2))
      );

      await fetch(
        `https://platif-ai-default-rtdb.asia-southeast1.firebasedatabase.app/Penerima/${plat}/sisaK.json`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSisa),
        }
      );

      setDataKendaraan((prev) =>
        prev ? { ...prev, sisaK: newSisa } : prev
      );

      toast.success("Pembelian berhasil");

      handleResetData(1500);
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
      toast.error("Pembelian gagal!");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const handleResetData = async (delay: number) => {
    setPlat("...");
    setLastUpdate("");
    setNominal(0);

    setTimeout(() => {
      setDataKendaraan(null);
    }, delay);

    await fetch("/api/darijetson", { method: "DELETE" });

    // update data di Firebase biar Jetson tahu reset
    await fetch(
      "https://platif-ai-default-rtdb.asia-southeast1.firebasedatabase.app/detect.json",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(true), // set detect = false
      }
    );

    console.log("Data Jetson direset di Firebase");
  };

  // polling plat Jetson + fetch Firebase + fetch harga BBM
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/darijetson");
        if (res.ok) {
          const data = await res.json();
          if (data.plat) {
            setPlat(data.plat);
            setLastUpdate(new Date().toLocaleString("id-ID"));
          }
        }
      } catch (err) {
        console.error("Gagal fetch plat:", err);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [plat]);

  useEffect(() => {
    if (plat === "..." || !plat) return;

    if (plat === "0") {
      // kalau Jetson kirim "0", artinya plat tidak terdaftar
      setDataKendaraan(null);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://platif-ai-default-rtdb.asia-southeast1.firebasedatabase.app/Penerima.json"
        );
        const json = await res.json();
        if (json && json[plat]) {
          setDataKendaraan(json[plat]);
        } else {
          setDataKendaraan(null);
        }
      } catch (err) {
        console.error("Gagal ambil data Firebase:", err);
      }
    };

    fetchData();
  }, [plat]);

  useEffect(() => {
    const fetchHarga = async () => {
      try {
        const res = await fetch(
          "https://platif-ai-default-rtdb.asia-southeast1.firebasedatabase.app/HargaBBM.json"
        );
        const json = await res.json();
        setHargaBBM(json || {});
      } catch (err) {
        console.error("Gagal ambil HargaBBM:", err);
      }
    };
    fetchHarga();
  }, []);

  const liter =
    dataKendaraan && hargaBBM[dataKendaraan.jenisB]
      ? Number((nominal / hargaBBM[dataKendaraan.jenisB]).toFixed(2))
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="flex items-center justify-between py-3 px-4 md:px-6 w-full">
          {/* Logo */}
          <div className="flex items-center space-x-4 ml-5">
            <img src="/Platif-AI.png" alt="Logo 1" className="h-9 w-full object-contain" />
            {/* <img src="/penslogo.png" alt="Logo 2" className="h-8 w-8 object-contain" />
            <img src="/pertaminalogo.png" alt="Logo 3" className="h-8 w-8 object-contain" /> */}
          </div>

          {/* Info Akun */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-100 transition"
            >
              <img
                src="/petugas.png" // ganti dengan foto user
                alt="Avatar"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-black font-medium">Basuki TP</span>
              <svg
                className={`w-4 h-4 text-black transition-transform ${showDropdown ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => {
                    console.log("Logout clicked");
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-22 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Kiri: Info Kendaraan */}
          <Card className="rounded-2xl shadow-lg border border-gray-200 bg-white">
            <CardContent className="flex flex-col items-center space-y-6 p-6">
              {plat === "0" ? (
                <p className="text-red-600 font-extrabold text-center text-5xl">
                  Plat nomor tidak terdaftar sebagai penerima BBM bersubsidi.
                </p>
              ) :dataKendaraan ? (
                <>
                  {/* Foto kendaraan */}
                  <div className="w-96 h-64">
                    <img
                      src={`kendaraan/${dataKendaraan.platN}.jpg`}
                      alt="Foto Kendaraan"
                      className="w-full h-full rounded-xl object-cover shadow-md"
                    />
                  </div>

                  {/* Nama pemilik dan plat */}
                  <div className="text-center">
                    <p className="text-indigo-600 font-bold text-2xl tracking-wider">
                      {dataKendaraan.platN}
                    </p>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {dataKendaraan.Pemilik}
                    </h2>
                  </div>

                  {/* Progress bar kuota */}
                  <div className="w-full mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">Sisa Kuota Harian</span>
                      <span className="text-xs text-gray-500">
                        {dataKendaraan?.sisaK ?? 0} L dari {dataKendaraan?.kuotaH ?? 0} L
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all"
                        style={{
                          width: `${
                            dataKendaraan ? (dataKendaraan.sisaK / dataKendaraan.kuotaH) * 100 : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Detail kendaraan dengan garis pemisah */}
                  <div className="w-full border-t border-gray-200 divide-y divide-gray-200 text-sm text-gray-700">
                    <div className="flex justify-between py-2">
                      <span className="font-semibold text-gray-900">Jenis BBM</span>
                      <span>{dataKendaraan?.jenisB ?? "-"}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-semibold text-gray-900">Jenis Kendaraan</span>
                      <span>{dataKendaraan?.jenisK ?? "-"}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-semibold text-gray-900">Merek</span>
                      <span>{dataKendaraan?.merekK ?? "-"}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-semibold text-gray-900">Warna</span>
                      <span>{dataKendaraan?.warnaK ?? "-"}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-semibold text-gray-900">Tahun</span>
                      <span>{dataKendaraan?.tahunR ?? "-"}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">Menunggu data kendaraan...</p>
              )}
            </CardContent>
          </Card>

          {/* Kanan: Form Pembelian */}
          <Card className="rounded-2xl shadow-lg border border-gray-200 bg-white">
            <CardContent className="flex flex-col items-center space-y-4">
              {/* Jenis BBM + waktu update */}
              <div className="w-full text-center bg-yellow-400 text-black py-3 rounded-lg text-xl font-bold shadow-inner">
                Pompa BBM 1
                <p className="text-xs font-normal mt-1">
                  {lastUpdate ? lastUpdate : "00/00/0000, 00.00.00"}
                </p>
              </div>

              {/* Nominal */}
              <div className="w-full text-center bg-gray-100 text-gray-800 py-3 mb-0 rounded-lg text-2xl font-semibold shadow-inner">
                {nominal.toLocaleString("id-ID")}
              </div>

              {/* Jenis BBM : Jumlah Liter */}
              <p className="text-gray-700 font-medium">
                {dataKendaraan && hargaBBM[dataKendaraan.jenisB]
                  ? `${dataKendaraan.jenisB} : ${(nominal / hargaBBM[dataKendaraan.jenisB]).toFixed(2)} Liter`
                  : "BBM : 0.00 Liter"}
              </p>

              {/* Tombol Keypad */}
              <div className="grid grid-cols-3 gap-4 w-full mt-4">
                {[
                  1, 2, 3,
                  4, 5, 6,
                  7, 8, 9,
                ].map((val) => (
                  <Button
                    key={val}
                    className="bg-indigo-500 text-white hover:bg-indigo-600 h-13 rounded-xl py-2 transition-transform transform hover:scale-102"
                    onClick={() => handleAddNominal(val)}
                  >
                    {val}
                  </Button>
                ))}

                {/* Baris terakhir: 0, 000, delete */}
                <Button
                  className="bg-indigo-500 text-white hover:bg-indigo-600 h-13 rounded-xl py-2 transition-transform transform hover:scale-102"
                  onClick={() => handleAddNominal(0)}
                >
                  0
                </Button>
                <Button
                  className="bg-indigo-500 text-white hover:bg-indigo-600 h-13 rounded-xl py-2 transition-transform transform hover:scale-102"
                  onClick={() => handleAddNominal("000")}
                >
                  000
                </Button>
                <Button
                  className="bg-red-500 text-white hover:bg-red-600 h-13 rounded-xl py-2 transition-transform transform hover:scale-102"
                  onClick={() => setNominal((prev) => Math.floor(prev / 10))}
                >
                  ⌫
                </Button>
              </div>

              {/* Clear button */}
              <Button
                variant="destructive"
                className="w-full py-3 rounded-xl text-lg font-medium h-13 shadow-md hover:scale-102 transition-transform"
                onClick={handleClear}
              >
                Clear
              </Button>

              {/* Submit button */}
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 h-13 rounded-xl text-lg font-medium shadow-md hover:scale-102 transition-transform"
                onClick={handleCheckAndOpenConfirm}
              >
                Submit
              </Button>

              <Button
                className="w-full py-3 rounded-xl text-lg font-medium h-13 shadow-md hover:scale-102 transition-transform bg-yellow-400 hover:bg-yellow-500 text-white"
                onClick={() => handleResetData(0)}
              >
                Reset Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Popup Konfirmasi */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="rounded-2xl shadow-lg border border-gray-200 bg-gradient-to-b from-white to-gray-50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-gray-800">
              Konfirmasi Pembelian
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="mt-2 text-gray-600">
                <span className="text-black">Pastikan data berikut benar sebelum menyimpan:</span>
                <div className="mt-3 space-y-2 text-sm bg-gray-100 p-3 rounded-lg">
                  <p><span className="font-medium text-base text-gray-700">Plat Nomor:</span> 
                    <span className="text-blue-600 text-base font-semibold"> {plat}</span>
                  </p>
                  <p><span className="font-medium text-base text-gray-700">Jenis BBM:</span>
                    <span className="text-blue-600 text-base font-semibold"> {dataKendaraan?.jenisB ?? "-"}</span>
                  </p>
                  <p><span className="font-medium text-base text-gray-700">Nominal:</span> 
                    <span className="text-blue-600 text-base font-semibold"> Rp {nominal.toLocaleString("id-ID")}</span>
                  </p>
                  <p><span className="font-medium text-base text-gray-700">Jumlah Liter:</span> 
                    <span className="text-blue-600 text-base font-semibold"> {liter} L</span>
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-2">
            <AlertDialogCancel className="rounded-xl text-white bg-red-500 hover:bg-red-800 hover:text-white px-6 py-6 transition">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-xl bg-green-600 text-white hover:bg-green-800 px-6 py-6 transition"
            >
              {loading ? "Menyimpan..." : "Ya, Simpan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
