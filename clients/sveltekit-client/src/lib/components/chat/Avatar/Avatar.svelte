<script lang="ts">
	// Styling
	import './Avatar.scss';

	// Various
	import { users } from '$lib/stores/UserStore';

	// Props
	export let onlineDot: boolean = false;
	export let img: string | null = null;
	export let loading: boolean = false;
	export let userId: string | null = null;

	// States
	let onlineDotLocal = false;

	// Susbcribe to useres store
	users.subscribe((userList) => {
		let found = userList.find((u) => u.id === userId);
		if (found) {
			onlineDotLocal = found.online || false;
		}
	});
</script>

{#if loading}
	<div class="avatar loading"></div>
{:else if img !== null}
	<div class="avatar">
		<img src={'http://localhost:4000/avatar/' + img} alt="" />
		{#if onlineDot || onlineDotLocal}<div class="online-dot"></div>{/if}
	</div>
{:else}
	<div class="avatar">
		{#if onlineDot || onlineDotLocal}
			<div class="online-dot"></div>
		{/if}
	</div>
{/if}
