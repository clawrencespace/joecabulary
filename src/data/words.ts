import archiveWordData from "./archive-words.json";

export interface WordEntry {
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  etymology: string;
  nuance: string;
  example: string;
  date: string;
  tags: string[];
}

export interface ArchiveWordEntry {
  word: string;
  definition: string;
  origin: string;
  nuance: string;
  example: string;
  date: string;
}

export const todayWords: WordEntry[] = [
  {
    word: "lodestar",
    pronunciation: "LOHD-star",
    partOfSpeech: "noun",
    definition: "A guiding principle, ideal, or person that gives direction.",
    etymology:
      "From Old English lād, meaning “course” or “journey,” plus star: literally, a star that shows the way.",
    nuance:
      "Stronger than a mere goal. A lodestar is the durable reference point used when choices get murky.",
    example:
      "Customer trust should be the lodestar for the whole migration, not an afterthought.",
    date: "2026-06-18",
    tags: ["leadership", "rhetoric"],
  },
  {
    word: "prescriptive",
    pronunciation: "prih-SKRIP-tiv",
    partOfSpeech: "adjective",
    definition: "Concerned with how something ought to be done, rather than only describing it.",
    etymology:
      "From Latin praescribere, “to write beforehand” or “to direct,” the root of prescribe.",
    nuance:
      "Often contrasted with descriptive. Prescriptive advice makes a judgment; descriptive analysis reports what is happening.",
    example:
      "The document is deliberately prescriptive about incident ownership but flexible about implementation.",
    date: "2026-06-18",
    tags: ["analysis", "management"],
  },
  {
    word: "manifold",
    pronunciation: "MAN-ih-fohld",
    partOfSpeech: "adjective",
    definition: "Many and varied; appearing in numerous forms or dimensions.",
    etymology:
      "From Old English manigfeald: “many-fold.” Its mathematical sense later described a space with complex dimensions.",
    nuance:
      "More than simply numerous. Manifold suggests multiplicity with meaningful variation or structure.",
    example:
      "The causes of the slowdown are manifold, so one heroic optimization probably will not fix it.",
    date: "2026-06-18",
    tags: ["systems", "analysis"],
  },
  {
    word: "irreducible",
    pronunciation: "ir-ih-DOO-suh-buhl",
    partOfSpeech: "adjective",
    definition: "Unable to be simplified, diminished, or explained in more basic terms.",
    etymology:
      "Built from Latin reducere, “to lead back,” with the negative prefix ir-: something that cannot be led back further.",
    nuance:
      "Useful for identifying the remainder that survives every attempted simplification, not merely something complicated.",
    example:
      "There is an irreducible amount of judgment in hiring; the rubric can only take us so far.",
    date: "2026-06-18",
    tags: ["philosophy", "analysis"],
  },
];

export const archiveWords: ArchiveWordEntry[] = [...archiveWordData].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export const wordCount = archiveWords.length;
export const editionCount = new Set(archiveWords.map((entry) => entry.date)).size;

const latestDate = archiveWords[0]?.date;
const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export const recentWords = archiveWords
  .filter((entry) => entry.date !== latestDate)
  .slice(0, 8)
  .map((entry) => ({
    word: entry.word,
    date: shortDate.format(new Date(`${entry.date}T00:00:00Z`)),
    note: entry.definition,
  }));
