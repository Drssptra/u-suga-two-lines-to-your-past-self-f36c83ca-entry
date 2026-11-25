// u-suga-two-lines-to-your-past-self — make.fun entry, v2 resubmit.
//
// The brief asks for exactly two lines addressed to the author's
// past self. The first line freezes one concrete scene (a dealer,
// a guitar, a Saturday-morning yard sale); the second line names
// the price of letting it go — a decade of chasing worse guitars.
// Nothing here is random or time-dependent: the same input always
// yields the same two lines, byte for byte.
//
// Runtime: Node 22, stdlib only, no network access. The output
// lands in $MAKEFUN_OUTPUT_DIR/entry.txt (falling back to
// /output/entry.txt) as plain UTF-8 with exactly one "\n" between
// the two lines and none at the end.

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// Each line is assembled from its own fragment list so the text is
// easy to read and edit line by line, and so the join that produces
// the final entry is the single place the line separator lives.
// The apostrophe in "father's" is a plain ASCII character inside a
// double-quoted string, so it survives the join byte-for-byte.
const lineFragments: readonly (readonly string[])[] = [
  [
    "When the dealer offers you $400 for your father's guitar ",
    "at the yard sale on Saturday morning, ",
    "put it back in its case.",
  ],
  [
    "You spent the next ten years and thousands of dollars ",
    "buying worse guitars trying to find the one you already owned.",
  ],
];

const MAX_CHARS = 280;
const MIN_CHARS = 1;
const EXPECTED_LINES = 2;

// Rebuild the entry from the fragments, one "\n" per line break.
// A joined result has exactly EXPECTED_LINES - 1 separators and
// no trailing newline by construction.
function buildEntry(lines: readonly (readonly string[])[]): string {
  return lines.map((parts) => parts.join("")).join("\n");
}

// Run every gate the brief imposes and report the first failure
// with enough detail to fix it, instead of failing silently.
function checkEntry(text: string): void {
  const problems: string[] = [];

  if (text.length < MIN_CHARS || text.length > MAX_CHARS) {
    problems.push(
      `length ${text.length} chars is outside the ${MIN_CHARS}-${MAX_CHARS} gate`,
    );
  }
  const lines = text.split("\n");
  if (lines.length !== EXPECTED_LINES) {
    problems.push(`expected ${EXPECTED_LINES} lines, found ${lines.length}`);
  }
  if (lines.some((line) => line.trim().length === 0)) {
    problems.push("a line is empty or whitespace-only");
  }
  if (text.endsWith("\n")) {
    problems.push("entry must not end with a trailing newline");
  }
  if (problems.length > 0) {
    throw new Error(
      `entry failed validation (${text.length} chars): ${problems.join("; ")}`,
    );
  }
}

const entry = buildEntry(lineFragments);
checkEntry(entry);

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(resolve(outputDir, "entry.txt"), entry, { encoding: "utf8" });

process.stdout.write(`${entry}\n`);
