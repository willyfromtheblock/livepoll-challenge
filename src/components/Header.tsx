import { Link } from "@tanstack/react-router";
import { Vote } from "lucide-react";

export default function Header() {
	return (
		<header className="px-6 py-4 flex items-center bg-slate-800 border-b border-slate-700">
			<Link to="/" className="flex items-center gap-3">
				<Vote className="w-6 h-6 text-cyan-400" />
				<span className="text-xl font-bold text-white">LivePoll</span>
			</Link>
		</header>
	);
}
