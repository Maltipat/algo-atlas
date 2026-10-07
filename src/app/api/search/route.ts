import { NextResponse } from "next/server";
import { search, type SearchKind } from "@/lib/engine/search";

/** GET /api/search?q=binary+tree&kind=problem,topic */
export function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const q = sp.get("q") ?? "";
  const kinds = sp.get("kind")?.split(",").filter(Boolean) as SearchKind[] | undefined;
  return NextResponse.json({ q, results: search(q, kinds?.length ? kinds : undefined, 50) });
}
