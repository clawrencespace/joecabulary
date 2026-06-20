import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const archivePath = path.join(projectRoot, "src/data/archive-words.json");
const editionsPath = path.join(projectRoot, "src/data/editions.json");

const args = process.argv.slice(2);
const sourceFlag = args.indexOf("--source");
const dateFlag = args.indexOf("--date");
const sourcePath = sourceFlag >= 0 ? args[sourceFlag + 1] : undefined;
const expectedDate = dateFlag >= 0 ? args[dateFlag + 1] : undefined;

if (!sourcePath || !expectedDate) {
  throw new Error("Usage: npm run publish-daily -- --date YYYY-MM-DD --source /path/to/edition.json");
}

const edition = JSON.parse(await readFile(path.resolve(sourcePath), "utf8"));
const requiredWordFields = [
  "word",
  "pronunciation",
  "partOfSpeech",
  "definition",
  "origin",
  "nuance",
  "example",
];

if (edition.date !== expectedDate) {
  throw new Error(`Edition date ${edition.date ?? "(missing)"} does not match ${expectedDate}`);
}

if (typeof edition.summary !== "string" || !edition.summary.trim()) {
  throw new Error("Edition summary must be a non-empty string");
}

if (!Array.isArray(edition.words) || edition.words.length !== 4) {
  throw new Error("Each daily edition must contain exactly four words");
}

const normalizedWords = edition.words.map((entry, index) => {
  for (const field of requiredWordFields) {
    if (typeof entry[field] !== "string" || !entry[field].trim()) {
      throw new Error(`Word ${index + 1} has an invalid ${field}`);
    }
  }

  if (!Array.isArray(entry.tags) || entry.tags.length < 1 || entry.tags.some((tag) => typeof tag !== "string")) {
    throw new Error(`Word ${index + 1} must have at least one string tag`);
  }

  return {
    word: entry.word.trim(),
    pronunciation: entry.pronunciation.trim(),
    partOfSpeech: entry.partOfSpeech.trim(),
    definition: entry.definition.trim(),
    origin: entry.origin.trim(),
    nuance: entry.nuance.trim(),
    example: entry.example.trim(),
    date: edition.date,
    tags: entry.tags.map((tag) => tag.trim()).filter(Boolean),
  };
});

const uniqueWords = new Set(normalizedWords.map((entry) => entry.word.toLowerCase()));
if (uniqueWords.size !== normalizedWords.length) {
  throw new Error("A daily edition cannot contain duplicate words");
}

const archive = JSON.parse(await readFile(archivePath, "utf8"));
const editions = JSON.parse(await readFile(editionsPath, "utf8"));

const nextArchive = [
  ...archive.filter((entry) => entry.date !== edition.date),
  ...normalizedWords,
].sort((a, b) => a.date.localeCompare(b.date));

const nextEditions = [
  ...editions.filter((entry) => entry.date !== edition.date),
  { date: edition.date, summary: edition.summary.trim() },
].sort((a, b) => a.date.localeCompare(b.date));

await writeFile(archivePath, `${JSON.stringify(nextArchive, null, 2)}\n`);
await writeFile(editionsPath, `${JSON.stringify(nextEditions, null, 2)}\n`);

console.log(`Prepared Joecabulary edition ${edition.date}: ${normalizedWords.map((entry) => entry.word).join(", ")}`);
