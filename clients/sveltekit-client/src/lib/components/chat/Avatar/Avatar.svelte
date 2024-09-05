<script lang="ts">
	import { users } from '$lib/stores/UserStore';
	import type { User } from '$lib/types/prisma';
	import './Avatar.scss';

	export let onlineDot: boolean = false;
	export let img: string | null = null;
	export let loading: boolean = false;
	export let userId: string | null = null;
	let user: User | null = null;
	let showDot = false;

	users.subscribe((userList) => {
		let found = userList.find((u) => u.id === userId);
		if (found) user = found;
	});

	$: {
		if (onlineDot) showDot = true;
		if (user) {
			if ((user as User).online) showDot = true;
		}
	}
</script>

{#if loading}
	<div class="avatar loading"></div>
{:else if img !== null}
	<div class="avatar">
		<img src={'http://localhost:4000/avatar/' + img} alt="" />
		{#if showDot}<div class="online-dot"></div>{/if}
	</div>
{:else}
	<div class="avatar">
		{#if showDot}
			<div class="online-dot"></div>
		{/if}
	</div>
{/if}
