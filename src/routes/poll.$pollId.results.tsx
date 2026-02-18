import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Share2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { getPollResults } from "../server/polls";

const COLORS = ["#06b6d4", "#8b5cf6", "#f59e0b", "#10b981", "#f43f5e"];

const pollResultsQueryOptions = (pollId: string) =>
	queryOptions({
		queryKey: ["poll", pollId, "results"],
		queryFn: () => getPollResults({ data: { pollId } }),
		refetchInterval: 2000,
	});

export const Route = createFileRoute("/poll/$pollId/results")({
	loader: ({ context, params }) => {
		context.queryClient.ensureQueryData(pollResultsQueryOptions(params.pollId));
	},
	component: ResultsPage,
});

function ResultsPage() {
	const { pollId } = Route.useParams();
	const { data: results } = useSuspenseQuery(pollResultsQueryOptions(pollId));

	const [copied, setCopied] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!results) {
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

	const chartData = results.options.map((option) => ({
		name: option.text,
		votes: option.votes,
		id: option.id,
	}));

	const shareUrl = mounted ? `${window.location.origin}/poll/${pollId}` : "";

	async function copyShareLink() {
		try {
			await navigator.clipboard.writeText(shareUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Fallback: select text
		}
	}

	return (
		<div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
			<div className="max-w-3xl mx-auto px-6 py-16">
				<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
					<div className="flex items-start justify-between mb-8">
						<div>
							<h1 className="text-2xl font-bold text-white mb-2">
								{results.question}
							</h1>
							<div className="flex items-center gap-2 text-gray-400 text-sm">
								<Users className="w-4 h-4" />
								<span>
									{results.totalVotes}{" "}
									{results.totalVotes === 1 ? "vote" : "votes"}
								</span>
								<span className="text-gray-600">·</span>
								<span className="text-emerald-400">Live updating</span>
							</div>
						</div>
					</div>

					{results.totalVotes > 0 && (
						<div className="mb-8 h-64">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									data={chartData}
									layout="vertical"
									margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
								>
									<XAxis type="number" hide />
									<YAxis
										type="category"
										dataKey="name"
										width={120}
										tick={{ fill: "#d1d5db", fontSize: 14 }}
										axisLine={false}
										tickLine={false}
									/>
									<Tooltip
										contentStyle={{
											backgroundColor: "#0f172a",
											border: "1px solid #334155",
											borderRadius: "8px",
										}}
										labelStyle={{ color: "#f1f5f9", fontWeight: 600 }}
										itemStyle={{ color: "#94a3b8" }}
										formatter={(value) => [
											`${value} ${value === 1 ? "vote" : "votes"}`,
										]}
										cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
									/>
									<Bar dataKey="votes" radius={[0, 6, 6, 0]} barSize={32}>
										{chartData.map((entry, index) => (
											<Cell
												key={entry.id}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						</div>
					)}

					<div className="space-y-4">
						{results.options.map((option, index) => (
							<div key={option.id}>
								<div className="flex items-center justify-between mb-1">
									<span className="text-white font-medium">{option.text}</span>
									<span className="text-gray-400 text-sm">
										{option.votes} {option.votes === 1 ? "vote" : "votes"} (
										{option.percentage}%)
									</span>
								</div>
								<div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
									<div
										className="h-full rounded-full transition-all duration-500"
										style={{
											width: `${option.percentage}%`,
											backgroundColor: COLORS[index % COLORS.length],
										}}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="mt-6 flex items-center justify-center gap-6">
					<Link
						to="/poll/$pollId"
						params={{ pollId }}
						className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 text-sm transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to poll
					</Link>

					{mounted && (
						<button
							type="button"
							onClick={copyShareLink}
							className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 text-sm transition-colors"
						>
							<Share2 className="w-4 h-4" />
							{copied ? "Link copied!" : "Share poll"}
						</button>
					)}

					<Link
						to="/"
						className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 text-sm transition-colors"
					>
						Create new poll
					</Link>
				</div>
			</div>
		</div>
	);
}
