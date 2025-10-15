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
	<link rel="icon" href={favicon} />
	<link rel="manifest" href="/manifest.json" />
</svelte:head>

{@render children?.()}
