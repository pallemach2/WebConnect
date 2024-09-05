<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import TokenService from '$lib/services/token.service';

	if (browser) {
		if (TokenService.getLocalToken()) {
			goto('/chat');
		} else {
			goto('/signin');
		}
	}
</script>
