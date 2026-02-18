import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/poll/$pollId")({
	component: () => <Outlet />,
});
