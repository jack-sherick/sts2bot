// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, AttachmentBuilder } = require('discord.js');

require('dotenv').config();
const token = process.env.WORKING_BRANCH_TOKEN;

const path = require("path");
const cards = require("./lib/cards.json");
const relics = require("./lib/relics.json");
const relic_desc = require("./lib/relic_desc.json");

// Create a new client instance
const client = new Client({ intents: [
	GatewayIntentBits.Guilds
	, GatewayIntentBits.GuildMessages
	, GatewayIntentBits.MessageContent
] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (msg) => {
	try {
		if (msg.author.bot) return;

		const matches = [...msg.content.matchAll(/<<(.+?)>>/g)]; // looks for <<card name>>

		if (!matches.length) return;

		for (const i of matches) {
			const query = i[1].trim().toLowerCase().replace("+", " plus");

			const result = match(query);

			if (!result) {
				await msg.channel.send(`No query found matching **${query.split(" ").map(t => {
					return t.charAt(0).toUpperCase() + t.slice(1);
				}).join(" ")}**.`);

				continue;
			}

			console.log(result);

			const attachment = new AttachmentBuilder(path.join(__dirname, result.folder, result.file));
			await msg.channel.send({ files: [attachment] });

			if (result.folder === "relics") {
				for (const j of relic_desc) {
					if (j.name.toLowerCase() == query) {
						await msg.channel.send(formatDescription(j.description));
					}
				}
			}
		}
		
	} catch (err) {
		console.error("MessageCreate error: ", err);
	}
})


function match(query) {
	if (cards[query]) return { file: cards[query], folder: "cards" };
	if (relics[query]) return { file: relics[query], folder: "relics" };

	const cardKey = Object.keys(cards).find(k => k.includes(query));
	if (cardKey) return { file: cards[cardKey], folder: "cards" };

	const relicKey = Object.keys(relics).find(k => k.includes(query));
	if (relicKey) return { file: relics[relicKey], folder: "relics" };

	return null;
}

function formatDescription(desc) { // lowk didn't realize discord had it in itself
	const colorMap = {
		red:   '\u001b[31m',
		green: '\u001b[32m',
		gold:  '\u001b[33m',
		blue:  '\u001b[34m',
	};

	const reset = '\u001b[0m';
	const formatted = desc
		.replace(/\[energy:(\d+)\]/g, (_, num) => `${colorMap.gold}${'\u26A1'.repeat(Number(num))}${reset}`)
		.replace(/\[(\w+)\](.*?)\[\/\1\]/g, (_, color, text) => {
			return colorMap[color] ? `${colorMap[color]}${text}${reset}` : text;
		});

	return `\`\`\`ansi\n${formatted}\n\`\`\``;
}

// Log in to Discord with your client's token
client.login(token);