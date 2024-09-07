<script lang="ts">
	// Various
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import TokenService from '$lib/services/token.service';

	// Redirect after 404
	if (browser) {
		if (TokenService.getLocalToken()) {
			goto('/chat');
		} else {
			goto('/signin');
		}
	}
</script>
