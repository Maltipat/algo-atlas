import { NextResponse } from "next/server";
import { patterns } from "@/data/patterns";

export function GET() {
  return NextResponse.json({ patterns });
}
