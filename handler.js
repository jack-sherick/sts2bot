// probably a gross way to actually maintain a real app, and maybe if I gaf I'll make a real pipeline
// but for now we're taking the wiki and saving everything file, then parsing those files to figure out
// cards/relics/potions/events, find the name, make that the key, and point it to the appropiate file in a json

const fs = require("fs");
const path = require("path");

const IMAGE_DIR = "./images";
const OUTPUT_FILE = "cards.json";

const cards = {};

const files = fs.readdirSync(IMAGE_DIR).sort();

for (const filename of files) {
  const ext = path.extname(filename).toLowerCase();
  if (![".png", ".jpg", ".webp"].includes(ext)) continue;

  let key = filename;

  key = key.replace(/^\d+px-/, "");                           // remove "150px-"
  key = key.replace(/^StS2_[^-]+-/, "");                      // remove "StS2_xxxx-"
  key = key.split(/(?=[A-Z])/).join().replaceAll(",", " ");   // add spaces between multi-word names
  key = path.basename(key, ext);                              // remove extension

  console.log(key);

  cards[key.toLowerCase()] = filename;
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cards, null, 2));
console.log(`Generated ${Object.keys(cards).length} entries.`);