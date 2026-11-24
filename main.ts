// Two Lines to Your Past Self — make.fun bounty entry.
//
// A two-line warning sent back to the author's past self: line one
// names one specific moment, line two traces what it cost and what
// changed because of it. Writes the text to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt) with no
// trailing newline, and prints it to stdout.
// Node 22, stdlib only, no network, fully deterministic.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Line 1 warns about one specific moment; line 2 says why it
// mattered and what changed because of it.
const ENTRY =
  "When your boss offers you the promotion on the Friday before your holiday, ask for the weekend to think.\n" +
  "You said yes on the spot and spent the next two years managing a team instead of doing the work you actually loved.";

// The gate requires 1 to 280 characters of UTF-8 text, not only
// whitespace — the newline between the two lines counts toward it.
if (ENTRY.length < 1 || ENTRY.length > 280 || ENTRY.trim().length === 0) {
  throw new Error(`entry length ${ENTRY.length} is outside the 1-280 gate`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
console.log(ENTRY);
