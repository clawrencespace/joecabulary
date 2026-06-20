import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = path.resolve(projectRoot, "../..");
const archivePath = path.join(projectRoot, "src/data/archive-words.json");
const dailyRoot = path.join(workspaceRoot, "data/joecabulary/daily");

const guide = {
  heuristic: ["hyoo-RIS-tik", "Starts like “human,” the middle sounds like “wrist,” and it ends like “tick.”"],
  provisional: ["pruh-VIZH-uh-nuhl", "Starts like “provide,” uses the sound in “vision,” and ends like “channel” without the ch."],
  dispositive: ["dih-SPOZ-ih-tiv", "The stressed middle sounds like “suppose,” and the ending matches “positive.”"],
  spurious: ["SPYOOR-ee-uhs", "Sounds like “pure” with an s in front, followed by “ee-us.”"],
  salient: ["SAY-lee-uhnt", "Starts like “say,” followed by the ending of “valiant.”"],
  tractable: ["TRAK-tuh-buhl", "Starts like “track” and ends like “comfortable” without the com-for."],
  orthogonal: ["or-THOG-uh-nuhl", "Starts like “or,” the stressed middle rhymes with “log,” and it ends like “national” without nati."],
  asymmetric: ["ay-suh-MET-rik", "Starts like the letter A, then “some,” with the stressed sound from “metric.”"],
  material: ["muh-TEER-ee-uhl", "The stressed middle sounds like “tier,” followed by the ending of “serial.”"],
  contingent: ["kuhn-TIN-juhnt", "Starts like “contain,” with the stressed vowel in “tin,” and ends like “gentle” without le."],
  cogent: ["KOH-juhnt", "Starts like “coat” without the t and ends like “gentle” without le."],
  specious: ["SPEE-shuhs", "Starts like “speed” without the d and ends like “precious” without pre."],
  tenable: ["TEN-uh-buhl", "Starts like “ten” and ends like “comfortable” without com-for."],
  granular: ["GRAN-yuh-ler", "Starts like “grand” without the d and ends like “regular” without reg."],
  durable: ["DOOR-uh-buhl", "Starts like “door” and ends like “comfortable” without com-for."],
  inchoate: ["in-KOH-uht", "Starts with “in,” then uses the c sound in “cat” and rhymes with “poet.”"],
  operative: ["OP-er-uh-tiv", "Starts like “opera” and ends like “positive” without posi."],
  amortize: ["uh-MOR-tyze", "The stressed middle sounds like “more,” and the ending rhymes with “prize.”"],
  priors: ["PRY-erz", "Sounds like “pliers” with an r instead of the l."],
  brittle: ["BRIT-uhl", "Starts like “Brit” and ends with the final sound in “little.”"],
  legible: ["LEJ-uh-buhl", "Starts like “ledge” and ends like “comfortable” without com-for."],
  catalytic: ["kat-uh-LIT-ik", "Starts like “cat,” the stressed middle sounds like “lit,” and it ends like “tick.”"],
  bounded: ["BOWN-did", "Starts like “bound” and ends like “did.”"],
  adjacent: ["uh-JAY-suhnt", "The stressed middle sounds like the letter J, and the ending resembles “recent” without re."],
  inflect: ["in-FLEKT", "Starts with “in” and ends like “collect” without co."],
  reconcile: ["REK-uhn-syle", "Starts like “wreck,” then “un,” and ends like “style” without the t."],
  latent: ["LAY-tuhnt", "Starts like “lay” and ends like “tent” with a softer middle vowel."],
  attenuate: ["uh-TEN-yoo-ayt", "The stressed syllable sounds like “ten,” followed by “you” and “eight.”"],
  proximate: ["PROK-suh-mit", "Starts like “proxy” without the y and ends like “submit” without sub."],
  canonical: ["kuh-NON-ih-kuhl", "The stressed middle sounds like “non,” and the ending resembles “chronicle” without chron."],
  exogenous: ["ek-SOJ-uh-nuhs", "Starts like the letter X, the stressed middle sounds like “lodge” without l, and it ends like “generous” without ger."],
  parsimonious: ["par-suh-MOH-nee-uhs", "Starts like “par,” the stressed middle sounds like “moan,” and it ends with “knee-us.”"],
  invariant: ["in-VAIR-ee-uhnt", "Starts with “in,” the stressed middle sounds like “vary,” and it ends like “ant.”"],
  materiality: ["muh-teer-ee-AL-ih-tee", "It begins like “material,” with the stress shifting to “al,” and ends like “city” without s."],
  aperture: ["AP-er-cher", "Starts like “apple” without le and ends like “picture” without pict."],
  contour: ["KON-toor", "Starts like “con” and ends like “tour.”"],
  obviate: ["OB-vee-ayt", "Starts like “obvious” without ous and ends like “eight.”"],
  substrate: ["SUB-strayt", "Starts like “sub” and ends like “straight.”"],
  ratchet: ["RACH-it", "Starts like “scratch” without the sc and ends like “it.”"],
  reify: ["RAY-uh-fy", "Starts like “ray” and ends like “defy” without de."],
  adjudicate: ["uh-JOO-dih-kayt", "The stressed syllable sounds like “jewel” without the l, followed by the ending of “dedicate.”"],
  bifurcate: ["BY-fur-kayt", "Starts like “buy,” followed by “fur,” and ends like “Kate.”"],
  instrumentalize: ["in-struh-MEN-tuh-lyze", "Starts like “instrument,” stresses “men,” and ends like “lies.”"],
  underwrite: ["UN-der-ryte", "Sounds exactly like “under” plus “write.”"],
  remit: ["REE-mit", "Starts like “read” without the d and ends like “mitt.”"],
  tranche: ["trahnsh", "Rhymes with “launch” in many American pronunciations, but ends with a sh sound."],
  overdetermined: ["OH-ver-dih-TUR-mind", "Starts like “over,” stresses the first part of “terminal,” and ends like “mind.”"],
  probabilistic: ["prob-uh-buh-LIS-tik", "Starts like “probable,” stresses “list,” and ends like “tick.”"],
  tacit: ["TAS-it", "Starts like “task” without k and ends like “it.”"],
  fungible: ["FUN-juh-buhl", "Starts like “fun” and ends like “eligible” without eli."],
  allocative: ["AL-uh-kay-tiv", "Starts like “alley” and ends with the “kay-tiv” sound in “educative.”"],
  confound: ["kuhn-FOWND", "Starts like “contain” without tai and ends like “found.”"],
  proviso: ["pruh-VY-zoh", "Starts like “provide” without de and ends like “zone” without n."],
  disambiguate: ["dis-am-BIG-yoo-ayt", "Starts like “diss,” stresses “big,” then sounds like “you eight.”"],
  fulcrum: ["FULL-kruhm", "Starts like “full” and ends like “crumb” without b."],
  slippage: ["SLIP-ij", "Starts like “slip” and ends like “image” without ma."],
  regime: ["ruh-ZHEEM", "Starts like “return” without turn and ends like “dream” with a zh sound."],
  ascribe: ["uh-SKRYBE", "Starts with a soft “uh” and ends like “scribe.”"],
  frictional: ["FRIK-shuh-nuhl", "Starts like “friction” and ends like “national” without nati."],
  robustness: ["roh-BUST-nis", "Starts like “robust” and ends like “business” without busi."],
  provenance: ["PRAHV-nuhns", "Sounds like “province” with an ah vowel in the first syllable."],
  topology: ["tuh-POL-uh-jee", "The stressed middle sounds like “Paul,” and it ends like “biology” without bi."],
  valence: ["VAY-luhns", "Starts like “vale” and ends like “balance” without ba."],
  fidelity: ["fih-DEL-ih-tee", "The stressed middle sounds like “deli,” and it ends like “city” without s."],
  germane: ["jer-MAYN", "Starts like “jer” in “jersey” and ends like “main.”"],
  precipitate: ["pruh-SIP-ih-tayt", "The stressed middle sounds like “sip,” and the ending sounds like “itate” in “irritate.”"],
  stochastic: ["stuh-KAS-tik", "Starts like “stuck” with a softer vowel, stresses “cast,” and ends like “tick.”"],
  gambit: ["GAM-bit", "Starts like “gamble” without le and ends like “bit.”"],
  lodestar: ["LOHD-star", "Sounds exactly like “load” plus “star.”"],
  prescriptive: ["prih-SKRIP-tiv", "The stressed middle sounds like “script,” and the ending matches “descriptive.”"],
  manifold: ["MAN-ih-fohld", "Starts like “man” and ends like “fold.”"],
  irreducible: ["ir-ih-DOO-suh-buhl", "The stressed syllable sounds like “do,” and the ending resembles “usable” with an s sound."],
  rubric: ["ROO-brik", "Starts like “rue” and ends like “brick.”"],
  vector: ["VEK-ter", "Starts like “deck” with a v and ends like “ter” in “winter.”"],
  moot: ["MOOT", "Rhymes with “boot.”"],
  arbiter: ["AR-bih-ter", "Starts like the letter R, followed by “bit,” and ends like “ter” in “winter.”"],
  salience: ["SAY-lee-uhns", "Starts like “say,” then “Lee,” and ends like “once” with a softer vowel."],
  cadence: ["KAY-duhns", "Starts like the letter K and ends like “guidance” without gui."],
  optionality: ["op-shuh-NAL-ih-tee", "Starts like “option,” then uses the stressed vowel in “pal,” and ends like “city” without s."],
  arbitrage: ["AR-bih-trahzh", "Starts like “arbiter” through “arbi,” then ends with the sound in “garage.”"]
};

const ipaOverrides = {
  spurious: "ˈspjʊɹiəs",
  inchoate: "ɪnˈkoʊət",
  proximate: "ˈpɹɑːksəmət",
  tranche: "tɹɑːnʃ",
  allocative: "ˈæləˌkeɪtɪv",
  provenance: "ˈpɹɑːvnəns",
  germane: "dʒɚˈmeɪn",
  arbitrage: "ˈɑːɹbɪˌtɹɑːʒ"
};

const archive = JSON.parse(await readFile(archivePath, "utf8"));
const missing = archive.filter((entry) => !guide[entry.word]);
if (missing.length) {
  throw new Error(`Missing pronunciation guidance for: ${missing.map((entry) => entry.word).join(", ")}`);
}

const enrich = (entry) => {
  const [pronunciation, soundsLike] = guide[entry.word];
  const ipa = ipaOverrides[entry.word] ?? execFileSync(
    "espeak-ng",
    ["-v", "en-us", "-q", "--ipa=3", entry.word],
    { encoding: "utf8" },
  ).trim().replaceAll("\u200d", "");

  return { ...entry, pronunciation, ipa, soundsLike };
};

await writeFile(archivePath, `${JSON.stringify(archive.map(enrich), null, 2)}\n`);

for (const date of ["2026-06-19", "2026-06-20"]) {
  const sourcePath = path.join(dailyRoot, `${date}.json`);
  const edition = JSON.parse(await readFile(sourcePath, "utf8"));
  edition.words = edition.words.map(enrich);
  await writeFile(sourcePath, `${JSON.stringify(edition, null, 2)}\n`);
}

console.log(`Enriched ${archive.length} archived words plus the June 19–20 source editions.`);
