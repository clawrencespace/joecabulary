import puzzleData from "./puzzle-data.json";

export interface PuzzleEntry {
  number: number;
  answer: string;
  clue: string;
  row: number;
  col: number;
  direction: "across" | "down";
}

export interface Puzzle {
  slug: string;
  title: string;
  eyebrow: string;
  date: string;
  size: number;
  entries: PuzzleEntry[];
}

const puzzleDate = (puzzle: Puzzle) => new Date(`${puzzle.date} 00:00:00 UTC`).getTime();
const puzzleNumber = (index: number) => `No. ${String(index + 1).padStart(3, "0")}`;
const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export const allPuzzles = [...(puzzleData as Puzzle[])].sort((a, b) => puzzleDate(a) - puzzleDate(b));
export const previewPuzzle = allPuzzles[0];
export const latestPuzzle = allPuzzles.at(-1);

export const archivePuzzles = allPuzzles
  .map((puzzle, index) => ({
    title: puzzle.title,
    number: puzzleNumber(index),
    date: shortDate.format(new Date(`${puzzle.date} 00:00:00 UTC`)),
    status:
      puzzle.slug === latestPuzzle?.slug ? "Live" : puzzle.eyebrow.includes("Preview") ? "Preview" : "Archive",
    slug: puzzle.slug,
    words: puzzle.entries.length,
  }))
  .reverse();
