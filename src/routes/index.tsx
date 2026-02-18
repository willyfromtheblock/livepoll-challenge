import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Trash2, Vote } from "lucide-react";
import type { SubmitEvent } from "react";
import { useId, useState } from "react";
import { createPoll } from "../server/polls";

export const Route = createFileRoute("/")({ component: CreatePollPage });

function CreatePollPage() {
	const navigate = useNavigate();
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState(["", ""]);
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const questionId = useId();
	const [optionKeys] = useState(() =>
		Array.from({ length: 5 }, () => crypto.randomUUID()),
	);

	function addOption() {
		if (options.length < 5) {
			setOptions([...options, ""]);
		}
	}

	function removeOption(index: number) {
		if (options.length > 2) {
			setOptions(options.filter((_, i) => i !== index));
		}
	}

	function updateOption(index: number, value: string) {
		const updated = [...options];
		updated[index] = value;
		setOptions(updated);
	}

	async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		const trimmedQuestion = question.trim();
		const trimmedOptions = options
			.map((o) => o.trim())
			.filter((o) => o.length > 0);

		if (!trimmedQuestion) {
			setError("Please enter a question");
			return;
		}
		if (trimmedOptions.length < 2) {
			setError("Please provide at least 2 options");
			return;
		}

		setSubmitting(true);
		try {
			const result = await createPoll({
				data: { question: trimmedQuestion, options: trimmedOptions },
			});
			await navigate({ to: "/poll/$pollId", params: { pollId: result.id } });
		} catch (err) {
			console.error("Failed to create poll:", err);
			setError("Failed to create poll. Please try again.");
			setSubmitting(false);
		}
	}

	return (
		<div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
			<div className="max-w-2xl mx-auto px-6 py-16">
				<div className="text-center mb-12">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 mb-6">
						<Vote className="w-8 h-8 text-cyan-400" />
					</div>
					<h1 className="text-4xl font-bold text-white mb-3">Create a Poll</h1>
					<p className="text-gray-400 text-lg">
						Ask a question, add options, and share the link to start collecting
						votes.
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8"
				>
					<div className="mb-8">
						<label
							htmlFor={questionId}
							className="block text-sm font-medium text-gray-300 mb-2"
						>
							Your Question
						</label>
						<input
							id={questionId}
							type="text"
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
							placeholder="What's your favorite programming language?"
							className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
							maxLength={200}
						/>
					</div>

					<div className="mb-8">
						<span className="block text-sm font-medium text-gray-300 mb-2">
							Options ({options.length}/5)
						</span>
						<div className="space-y-3">
							{options.map((option, index) => (
								<div key={optionKeys[index]} className="flex gap-2">
									<input
										type="text"
										value={option}
										onChange={(e) => updateOption(index, e.target.value)}
										placeholder={`Option ${index + 1}`}
										className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
										maxLength={100}
									/>
									{options.length > 2 && (
										<button
											type="button"
											onClick={() => removeOption(index)}
											className="px-3 py-3 text-gray-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
											aria-label="Remove option"
										>
											<Trash2 className="w-5 h-5" />
										</button>
									)}
								</div>
							))}
						</div>

						{options.length < 5 && (
							<button
								type="button"
								onClick={addOption}
								className="mt-3 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
							>
								<Plus className="w-4 h-4" />
								Add option
							</button>
						)}
					</div>

					{error && (
						<div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
							{error}
						</div>
					)}

					<button
						type="submit"
						disabled={submitting}
						className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/25"
					>
						{submitting ? "Creating..." : "Create Poll"}
					</button>
				</form>
			</div>
		</div>
	);
}
