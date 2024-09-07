<script lang="ts">
	// Components
	import { faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	// Various
	import { browser } from '$app/environment';
	import TokenService from '$lib/services/token.service';
	import { getReadableDate } from '$lib/services/util.service';

	// Props
	export let messageSeen: any[];
	export let participantsCounter: number;

	// States
	let user = null;

	// Read user from localstorage after browser load
	if (browser) {
		user = TokenService.getUser();
	}
</script>

{#if participantsCounter === 2}
	{#if messageSeen.length >= 2}
		{@const readTimestamp = messageSeen.find((ms) => ms.userId !== user?.id)}
		<div class="readby-container">
			<FontAwesomeIcon icon={faCheckDouble}></FontAwesomeIcon>
			<span class="readby-text">
				{getReadableDate(readTimestamp.timestamp, 'dd.mm.yyyy um hh:MM')}
			</span>
		</div>
	{:else}
		<div class="readby-container">
			<FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
			<span class="readby-text">Noch nicht gesehen</span>
		</div>
	{/if}
{:else}
	<div class="readby-container">
		<FontAwesomeIcon icon={faCheckDouble}></FontAwesomeIcon>
		<span class="readby-text">
			{messageSeen.length} von {participantsCounter}
		</span>
	</div>
{/if}
