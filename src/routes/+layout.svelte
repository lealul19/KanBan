<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from "svelte";

	let { children } = $props();

	onMount(() => {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker
				.register("/service-worker.js")
				.then(() => console.log(" Service Worker registered"))
				.catch((err) => console.error("Service Worker failed:", err));
		}
	});
</script>

<svelte:head>
	<title>Kanban Board - Task Management</title>
	<meta name="description" content="Modern Kanban board for efficient task management with drag & drop, PWA support, and export features" />
	<meta name="theme-color" content="#0369a1" />
	<link rel="icon" href={favicon} />
	<link rel="manifest" href="/manifest.json" />
</svelte:head>

{@render children?.()}
