import { PrismaClient } from "../src/generated/prisma/client.js";

import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
	console.log("Seeding database...");

	const poll = await prisma.poll.create({
		data: {
			question: "What is your favorite programming language?",
			options: {
				create: [
					{ text: "TypeScript", position: 0 },
					{ text: "Python", position: 1 },
					{ text: "Rust", position: 2 },
					{ text: "Go", position: 3 },
				],
			},
		},
		include: { options: true },
	});

	console.log(`Created sample poll: ${poll.id}`);
	console.log(`  Question: ${poll.question}`);
	console.log(
		`  Options: ${poll.options.map((o) => o.text).join(", ")}`,
	);
	console.log(`\nOpen http://localhost:3000/poll/${poll.id} to vote`);
}

main()
	.catch((e) => {
		console.error("Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
