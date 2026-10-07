/**
 * Runs every reference JavaScript solution against its own test cases using the
 * same harness the browser uses. Run with: npm run verify:problems
 */
import { problemDefs } from "../src/data/problems/defs";
import { build } from "../src/data/problems/builder";
import { HARNESS_SOURCE } from "../src/lib/execution/harness-source";

const runAll = new Function(`${HARNESS_SOURCE}; return runAll;`)() as (p: unknown) => {
  results: { id: string; passed: boolean; actual: unknown; expected: unknown }[];
  error: { type: string; message: string } | null;
};

let failures = 0, checked = 0, skipped = 0;
const slugs = new Set<string>();
problemDefs.forEach((def, i) => {
  const p = build(def, i + 1, []);
  if (slugs.has(p.slug)) { console.error(`Duplicate slug: ${p.slug}`); failures++; }
  slugs.add(p.slug);
  if (p.testCases.length < 2) { console.error(`${p.slug}: needs at least 2 test cases`); failures++; }
  if (!p.runnable) { skipped++; return; }
  const kind = "methods" in p.signature ? "design" : "fn";
  const out = runAll({ code: p.solution.javascript, sig: p.signature, kind, tests: p.testCases, mode: p.compare });
  checked++;
  if (out.error) { failures++; console.error(`✗ ${p.slug}: ${out.error.type} ${out.error.message}`); return; }
  for (const r of out.results) {
    if (!r.passed) { failures++; console.error(`✗ ${p.slug} [${r.id}] expected ${JSON.stringify(r.expected)} got ${JSON.stringify(r.actual)}`); }
  }
});
console.log(`${problemDefs.length} problems, ${checked} verified, ${skipped} non-runnable, ${failures} failures`);
process.exit(failures ? 1 : 0);
