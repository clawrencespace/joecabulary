import archiveWordData from "./archive-words.json";
import editionData from "./editions.json";

export interface WordEntry {
  word: string;
  pronunciation?: string;
  ipa?: string;
  soundsLike?: string;
  partOfSpeech?: string;
  definition: string;
  origin: string;
  nuance: string;
  example: string;
  date: string;
  tags?: string[];
}

interface EditionEntry {
  date: string;
  summary: string;
}

export const archiveWords: WordEntry[] = [...archiveWordData].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export const wordCount = archiveWords.length;
export const editionCount = new Set(archiveWords.map((entry) => entry.date)).size;

const latestDate = archiveWords[0]?.date;
export const todayWords = archiveWords.filter((entry) => entry.date === latestDate);
export const currentEdition = (editionData as EditionEntry[]).find(
  (edition) => edition.date === latestDate,
);

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
