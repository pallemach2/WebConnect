<script lang="ts">
	import { browser } from '$app/environment';
	import TokenService from '$lib/services/token.service';
	import { faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	export let messageSeen: any[];
	export let participantsCounter: number;
	let user = null;

	/**
	 * Get a readable string from a date
	 * @param date
	 * @param format
	 * @returns
	 */
	const getReadableDate = (date = new Date(), format = 'hh:MM') => {
		const dateObj = new Date(date);

		if (
			dateObj.getDay() !== new Date().getDay() ||
			dateObj.getMonth() !== new Date().getMonth() ||
			dateObj.getFullYear() !== new Date().getFullYear()
		) {
			return new Date(date).format('dd.mm.yyyy um hh:MM');
		}
		return new Date(date).format(format);
	};

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
