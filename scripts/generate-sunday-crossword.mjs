import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const archivePath = path.join(projectRoot, "src/data/archive-words.json");
const puzzlePath = path.join(projectRoot, "src/data/puzzle-data.json");

const args = process.argv.slice(2);
const dateFlag = args.indexOf("--date");
const editionDate = dateFlag >= 0 ? args[dateFlag + 1] : undefined;

if (!editionDate) {
  throw new Error("Usage: npm run generate-crossword -- --date YYYY-MM-DD");
}

const day = new Date(`${editionDate}T00:00:00Z`);
if (day.getUTCDay() !== 0) {
  console.log(`${editionDate} is not a Sunday; no crossword generated.`);
  process.exit(0);
}

const normalizeAnswer = (word) => word.toUpperCase().replace(/[^A-Z]/g, "");
const slug = `sunday-${editionDate}`;
const archive = JSON.parse(await readFile(archivePath, "utf8"));
const puzzles = JSON.parse(await readFile(puzzlePath, "utf8"));

const cutoff = day.getTime();
const weekStart = cutoff - 6 * 24 * 60 * 60 * 1000;
const weekWords = archive
  .filter((entry) => {
    const time = new Date(`${entry.date}T00:00:00Z`).getTime();
    return time >= weekStart && time <= cutoff;
  })
  .map((entry) => ({
    answer: normalizeAnswer(entry.word),
    clue: entry.definition.replace(/\.$/, ""),
    date: entry.date,
  }))
  .filter((entry) => entry.answer.length >= 5 && entry.answer.length <= 15);

if (weekWords.length < 6) {
  throw new Error(`Need at least six crossword-friendly words for ${editionDate}; found ${weekWords.length}`);
}

const size = 15;
const sortedWords = [...weekWords]
  .sort((a, b) => b.answer.length - a.answer.length || b.date.localeCompare(a.date))
  .slice(0, 18);

const makeEmptyGrid = () => Array.from({ length: size }, () => Array.from({ length: size }, () => ""));
const grid = makeEmptyGrid();
let placements = [];
let bestPlacements = [];

const canPlace = (answer, row, col, direction) => {
  if (direction === "across" && col + answer.length > size) return false;
  if (direction === "down" && row + answer.length > size) return false;

  let crosses = 0;
  for (let index = 0; index < answer.length; index += 1) {
    const r = row + (direction === "down" ? index : 0);
    const c = col + (direction === "across" ? index : 0);
    const current = grid[r][c];
    if (current && current !== answer[index]) return false;
    if (current === answer[index]) crosses += 1;
  }

  return placements.length === 0 || crosses > 0;
};

const scorePlacement = (answer, row, col, direction) => {
  let score = 0;
  for (let index = 0; index < answer.length; index += 1) {
    const r = row + (direction === "down" ? index : 0);
    const c = col + (direction === "across" ? index : 0);
    if (grid[r][c] === answer[index]) score += 10;
  }

  const midRow = row + (direction === "down" ? answer.length / 2 : 0);
  const midCol = col + (direction === "across" ? answer.length / 2 : 0);
  return score - Math.abs(midRow - size / 2) - Math.abs(midCol - size / 2);
};

const candidatePlacements = (entry) => {
  const candidates = [];
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      for (const direction of ["across", "down"]) {
        if (canPlace(entry.answer, row, col, direction)) {
          candidates.push({
            entry,
            row,
            col,
            direction,
            score: scorePlacement(entry.answer, row, col, direction),
          });
        }
      }
    }
  }

  return candidates.sort((a, b) => b.score - a.score).slice(0, 12);
};

const place = (candidate) => {
  const changed = [];
  for (let index = 0; index < candidate.entry.answer.length; index += 1) {
    const row = candidate.row + (candidate.direction === "down" ? index : 0);
    const col = candidate.col + (candidate.direction === "across" ? index : 0);
    if (!grid[row][col]) {
      grid[row][col] = candidate.entry.answer[index];
      changed.push([row, col]);
    }
  }

  placements.push({ ...candidate, changed });
};

const unplace = () => {
  const candidate = placements.pop();
  for (const [row, col] of candidate.changed) grid[row][col] = "";
};

const search = (remaining) => {
  if (placements.length > bestPlacements.length) {
    bestPlacements = placements.map(({ entry, row, col, direction }) => ({ entry, row, col, direction }));
  }

  if (!remaining.length || bestPlacements.length >= 10) return;

  const next = remaining
    .map((entry) => ({ entry, candidates: candidatePlacements(entry) }))
    .filter(({ candidates }) => candidates.length)
    .sort((a, b) => a.candidates.length - b.candidates.length)[0];

  if (!next) return;

  const nextRemaining = remaining.filter((entry) => entry.answer !== next.entry.answer);
  for (const candidate of next.candidates.slice(0, 8)) {
    place(candidate);
    search(nextRemaining);
    unplace();
  }
};

const seed = sortedWords[0];
place({
  entry: seed,
  row: Math.floor(size / 2),
  col: Math.max(0, Math.floor((size - seed.answer.length) / 2)),
  direction: "across",
  score: 0,
});
search(sortedWords.slice(1));
unplace();

if (bestPlacements.length < 6) {
  throw new Error(`Could only place ${bestPlacements.length} crossword entries for ${editionDate}`);
}

const numberedEntries = bestPlacements
  .sort((a, b) => a.row - b.row || a.col - b.col || a.direction.localeCompare(b.direction))
  .map((placement, index) => ({
    number: index + 1,
    answer: placement.entry.answer,
    clue: placement.entry.clue,
    row: placement.row,
    col: placement.col,
    direction: placement.direction,
  }));

const puzzleNumber = puzzles.filter((puzzle) => puzzle.slug).length + (puzzles.some((puzzle) => puzzle.slug === slug) ? 0 : 1);
const displayDate = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
}).format(day);

const titleWord = numberedEntries.find((entry) => entry.answer.length <= 10)?.answer ?? numberedEntries[0].answer;
const title = `${titleWord[0]}${titleWord.slice(1).toLowerCase()} Effects`;
const nextPuzzle = {
  slug,
  title,
  eyebrow: `Sunday No. ${String(puzzleNumber).padStart(3, "0")} · Live`,
  date: displayDate,
  size,
  entries: numberedEntries,
};

const nextPuzzles = [
  ...puzzles.filter((puzzle) => puzzle.slug !== slug),
  nextPuzzle,
].sort((a, b) => new Date(`${a.date} 00:00:00 UTC`).getTime() - new Date(`${b.date} 00:00:00 UTC`).getTime());

await writeFile(puzzlePath, `${JSON.stringify(nextPuzzles, null, 2)}\n`);

console.log(`Generated ${slug}: ${numberedEntries.map((entry) => entry.answer).join(", ")}`);
