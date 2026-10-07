import { NextResponse } from "next/server";
import { companies } from "@/data/companies";

export function GET() {
  return NextResponse.json({ companies });
}
