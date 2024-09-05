<script lang="ts">
	import { users } from '$lib/stores/UserStore';
	import type { User } from '$lib/types/prisma';

	/**
	 * Creates a readable string from date object
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

	export let userId: string;
	export let usersCounter: number;
	let userMeta: User | null = null;
	let online = false;
	let lastSeen: Date | null = null;

	users.subscribe((users) => {
		const res = users.find((u) => u.id === userId);
		if (res) {
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
