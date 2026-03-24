// probably a gross way to actually maintain a real app, and maybe if I gaf I'll make a real pipeline
// but for now we're taking the wiki and saving every file, then parsing those files to figure out
// cards/relics/potions/events, find the name, make that the key, and point it to the appropiate file in a json

const fs = require("fs");
const path = require("path");

const CARD_DIR = "./cards";
const CARD_OUTPUT_FILE = "./lib/cards.json";

const RELIC_DIR = "./relics";
const RELIC_OUTPUT_FILE = "./lib/relics.json";

const cards = {};
const relics = {};

const card_files = fs.readdirSync(CARD_DIR).sort();
const relic_files = fs.readdirSync(RELIC_DIR).sort();

for (const f of card_files) {
  const ext = path.extname(f).toLowerCase();
  if (![".png", ".jpg", ".webp"].includes(ext)) continue;

  let key = f;

  key = key.replace(/^\d+px-/, "");                           // remove "150px-"
  key = key.replace(/^StS2_[^-]+-/, "");                      // remove "StS2_xxxx-"
  key = key.split(/(?=[A-Z])/).join().replaceAll(",", " ");   // add spaces between multi-word names
  key = path.basename(key, ext);                              // remove extension

  console.log(key);

  cards[key.toLowerCase()] = f;
}

fs.writeFileSync(CARD_OUTPUT_FILE, JSON.stringify(cards, null, 2));
console.log(`Generated ${Object.keys(cards).length} entries.`);

// I will consolidate things into one loop at some point

for (const f of relic_files) {
  const ext = path.extname(f).toLowerCase();

  if (![".png", ".jpg", ".webp"].includes(ext)) continue;

  let key = f;

  key = key.replace(/^\d+px-/, "");                          
  key = key.replace(/^StS2_/, "");                     
  key = key.split(/(?=[A-Z])/).join().replaceAll(",", " ");   
  key = path.basename(key, ext);

  relics[key.toLowerCase()] = f;
}

fs.writeFileSync(RELIC_OUTPUT_FILE, JSON.stringify(relics, null, 2));
console.log(`Generated ${Object.keys(relics).length} enteries.`);
