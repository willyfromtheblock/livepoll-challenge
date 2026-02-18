import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BarChart3, CheckCircle2, Share2 } from "lucide-react";
import type { SubmitEvent } from "react";
import { useEffect, useState } from "react";
import { castVote, getPoll } from "../server/polls";

const pollQueryOptions = (pollId: string) =>
	queryOptions({
		queryKey: ["poll", pollId],
		queryFn: () => getPoll({ data: { pollId } }),
	});

export const Route = createFileRoute("/poll/$pollId/")({
	loader: ({ context, params }) => {
		context.queryClient.ensureQueryData(pollQueryOptions(params.pollId));
	},
	component: VotePage,
});

function getVoterToken(): string {
	let token = localStorage.getItem("livepoll-voter-token");
	if (!token) {
		token = crypto.randomUUID();
		localStorage.setItem("livepoll-voter-token", token);
	}
	return token;
}

function VotePage() {
	const { pollId } = Route.useParams();
	const navigate = useNavigate();
	const { data: poll } = useSuspenseQuery(pollQueryOptions(pollId));

	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [hasVoted, setHasVoted] = useState(false);
	const [copied, setCopied] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const voted = localStorage.getItem(`livepoll-voted-${pollId}`);
		if (voted) {
			setHasVoted(true);
		}
	}, [pollId]);

	if (!poll) {
		return (
			<div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-white mb-4">Poll not found</h1>
					<Link
						to="/"
						className="text-cyan-400 hover:text-cyan-300 transition-colors"
					>
						Create a new poll
					</Link>
				</div>
			</div>
		);
	}

	async function handleVote(e: SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!selectedOption) return;
		setError(null);
		setSubmitting(true);

		try {
			const voterToken = getVoterToken();
			const result = await castVote({
				data: { pollId, optionId: selectedOption, voterToken },
			});

			if (result.success) {
				localStorage.setItem(`livepoll-voted-${pollId}`, selectedOption);
				navigate({ to: "/poll/$pollId/results", params: { pollId } });
			} else {
				setError(result.error);
				if (result.error.includes("already voted")) {
					localStorage.setItem(`livepoll-voted-${pollId}`, "true");
					setHasVoted(true);
				}
			}
		} catch {
			setError("Failed to submit vote. Please try again.");
		} finally {
			setSubmitting(false);
		}
	}

	async function copyShareLink() {
		const url = window.location.href;
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Fallback: select text
		}
	}

	return (
		<div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
			<div className="max-w-2xl mx-auto px-6 py-16">
				<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
					<h1 className="text-2xl font-bold text-white mb-8">
						{poll.question}
					</h1>

					{mounted && hasVoted ? (
						<div className="text-center py-8">
							<CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
							<h2 className="text-xl font-semibold text-white mb-2">
								You've already voted!
							</h2>
							<p className="text-gray-400 mb-6">
								You can only vote once per poll.
							</p>
							<Link
								to="/poll/$pollId/results"
								params={{ pollId }}
								className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
							>
								<BarChart3 className="w-5 h-5" />
								View Results
							</Link>
						</div>
					) : (
						<form onSubmit={handleVote}>
							<div className="space-y-3 mb-8">
								{poll.options.map((option) => (
									<label
										key={option.id}
										className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
											selectedOption === option.id
												? "border-cyan-500 bg-cyan-500/10"
												: "border-slate-600 hover:border-slate-500 bg-slate-700/30"
										}`}
									>
										<input
											type="radio"
											name="poll-option"
											value={option.id}
											checked={selectedOption === option.id}
											onChange={() => setSelectedOption(option.id)}
											className="w-5 h-5 text-cyan-500 bg-slate-700 border-slate-500 focus:ring-cyan-500 focus:ring-offset-0"
										/>
										<span className="text-white text-lg">{option.text}</span>
									</label>
								))}
							</div>

							{error && (
								<div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
									{error}
								</div>
							)}

							<div className="flex flex-col gap-4">
								<button
									type="submit"
									disabled={!selectedOption || submitting}
									className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/25"
								>
									{submitting ? "Voting..." : "Cast Your Vote"}
								</button>

								<Link
									to="/poll/$pollId/results"
									params={{ pollId }}
									className="text-center text-gray-400 hover:text-cyan-400 text-sm transition-colors"
								>
									View results without voting
								</Link>
							</div>
						</form>
					)}
				</div>

				{mounted && (
					<div className="mt-6 flex items-center justify-center gap-4">
						<button
							type="button"
							onClick={copyShareLink}
							className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 text-sm transition-colors"
						>
							<Share2 className="w-4 h-4" />
							{copied ? "Link copied!" : "Copy share link"}
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
