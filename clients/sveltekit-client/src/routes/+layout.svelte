<script lang="ts">
	// Styling
	import './../lib/styles/index.scss';

	// Various
	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
			},
		},
	});
</script>

<QueryClientProvider client={queryClient}>
	<slot />
	<SvelteQueryDevtools />
</QueryClientProvider>
