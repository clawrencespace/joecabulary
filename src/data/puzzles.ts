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

export const previewPuzzle: Puzzle = {
  slug: "preview-001",
  title: "The First Pass",
  eyebrow: "Sunday No. 001 · Preview",
  date: "June 21, 2026",
  size: 13,
  entries: [
    {
      number: 1,
      answer: "IRREDUCIBLE",
      clue: "Resistant to any further simplification",
      row: 1,
      col: 4,
      direction: "down",
    },
    {
      number: 2,
      answer: "GERMANE",
      clue: "Actually relevant, not merely adjacent",
      row: 3,
      col: 2,
      direction: "across",
    },
    {
      number: 3,
      answer: "MANIFOLD",
      clue: "Numerous and meaningfully varied",
      row: 4,
      col: 8,
      direction: "down",
    },
    {
      number: 4,
      answer: "LODESTAR",
      clue: "A principle that keeps decisions pointed true",
      row: 5,
      col: 2,
      direction: "across",
    },
    {
      number: 5,
      answer: "GAMBIT",
      clue: "A calculated opening move",
      row: 9,
      col: 1,
      direction: "across",
    },
    {
      number: 6,
      answer: "VALENCE",
      clue: "Emotional charge or associative weight",
      row: 10,
      col: 6,
      direction: "across",
    },
  ],
};

export const archivePuzzles = [
  {
    title: "The First Pass",
    number: "No. 001",
    date: "Jun 21",
    status: "Preview",
    slug: "preview-001",
    words: 6,
  },
  {
    title: "Next Sunday",
    number: "No. 002",
    date: "Jun 28",
    status: "Upcoming",
    slug: "",
    words: 0,
  },
];
