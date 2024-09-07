<script lang="ts">
	import { getReadableDate } from '$lib/services/util.service';

	// Various
	import { users } from '$lib/stores/UserStore';
	import type { User } from '$lib/types/prisma';

	// Props
	export let userId: string;
	export let usersCounter: number;

	// States
	let userMeta: User | null = null;
	let online = false;
	let lastSeen: Date | null = null;

	// Subscribe to users store
	users.subscribe((users) => {
		const res = users.find((u) => u.id === userId);
		if (res) {
			// Set state parameters
			userMeta = res;
			online = res.online as boolean;
			lastSeen = res.lastSeen;
		}
	});
</script>

{#if !userMeta || usersCounter < 2}{''}{:else if usersCounter > 2}
	{usersCounter} Mitglieder
{:else if userMeta && online}
	Online
{:else}
	zul. online: {lastSeen ? getReadableDate(lastSeen) : 'Nie'}
{/if}
