import { createServerFn } from "@tanstack/react-start";
import { prisma } from "../db";

export const createPoll = createServerFn({ method: "POST" })
	.inputValidator((data: { question: string; options: string[] }) => {
		const question = data.question.trim();
		if (question.length === 0) {
			throw new Error("Question cannot be empty");
		}
		if (data.options.length < 2 || data.options.length > 5) {
			throw new Error("Must provide 2-5 options");
		}
		const options = data.options.map((o) => {
			const trimmed = o.trim();
			if (trimmed.length === 0) {
				throw new Error("All options must be non-empty strings");
			}
			return trimmed;
		});
		return { question, options };
	})
	.handler(async ({ data }) => {
		const poll = await prisma.poll.create({
			data: {
				question: data.question,
				options: {
					create: data.options.map((text, index) => ({
						text,
						position: index,
					})),
				},
			},
		});
		return { id: poll.id };
	});

export const getPoll = createServerFn({ method: "GET" })
	.inputValidator((data: { pollId: string }) => data)
	.handler(async ({ data }) => {
		const poll = await prisma.poll.findUnique({
			where: { id: data.pollId },
			include: {
				options: {
					orderBy: { position: "asc" },
				},
			},
		});
		return poll;
	});

export const getPollResults = createServerFn({ method: "GET" })
	.inputValidator((data: { pollId: string }) => data)
	.handler(async ({ data }) => {
		const poll = await prisma.poll.findUnique({
			where: { id: data.pollId },
			include: {
				options: {
					orderBy: { position: "asc" },
					include: {
						_count: {
							select: { votes: true },
						},
					},
				},
				_count: {
					select: { votes: true },
				},
			},
		});

		if (!poll) return null;

		const totalVotes = poll._count.votes;
		return {
			id: poll.id,
			question: poll.question,
			createdAt: poll.createdAt,
			totalVotes,
			options: poll.options.map((option) => ({
				id: option.id,
				text: option.text,
				position: option.position,
				votes: option._count.votes,
				percentage:
					totalVotes > 0
						? Math.round((option._count.votes / totalVotes) * 100)
						: 0,
			})),
		};
	});

export const castVote = createServerFn({ method: "POST" })
	.inputValidator(
		(data: { pollId: string; optionId: string; voterToken: string }) => data,
	)
	.handler(async ({ data }) => {
		const option = await prisma.pollOption.findFirst({
			where: { id: data.optionId, pollId: data.pollId },
		});
		if (!option) {
			return { success: false as const, error: "Invalid option" };
		}

		try {
			await prisma.vote.create({
				data: {
					pollId: data.pollId,
					optionId: data.optionId,
					voterToken: data.voterToken,
				},
			});
			return { success: true as const };
		} catch (error) {
			if (
				error instanceof Error &&
				error.message.includes("Unique constraint")
			) {
				return {
					success: false as const,
					error: "You have already voted on this poll",
				};
			}
			throw error;
		}
	});
