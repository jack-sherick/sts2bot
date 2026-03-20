// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const { token } = require('./config.json');

const path = require("path");
const cards = require("./cards.json");

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

			const card = findCard(query);

			if (!card) {
				await msg.channel.send(`No card found matching **${query.split(" ").map(t => {
					return t.charAt(0).toUpperCase() + t.slice(1);
				}).join(" ")}**.`);

				continue;
			}

			const attachment = new AttachmentBuilder(path.join(__dirname, "images", card));
			await msg.channel.send({ files: [attachment] });
		}
		
	} catch (err) {
		console.error("MessageCreate error: ", err);
	}
})

function findCard(query) {
	if (cards[query]) return cards[query];

	const key = Object.keys(cards).find(k => k.includes(query));

	return key ? cards[key] : null;
}

// Log in to Discord with your client's token
client.login(token);