import { NextResponse } from "next/server";

let lastPlat: string | null = null;

interface PlatRequest {
  plat: string;
}

export async function POST(req: Request) {
  try {
    const body: PlatRequest = await req.json();
    const { plat } = body;

    console.log("Plat diterima:", plat);

    // simpan plat terakhir
    lastPlat = plat;

    return NextResponse.json(
      { message: "Plat diterima", plat },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan", detail: String(error) },
      { status: 500 }
    );
  }
}

// Handler GET untuk polling dari client
export async function GET() {
  return NextResponse.json(
    { plat: lastPlat },
    { status: 200 }
  );
}

// Handler DELETE untuk reset plat
export async function DELETE() {
  lastPlat = null;
  return NextResponse.json(
    { message: "Plat direset" },
    { status: 200 }
  );
}
