<script lang="ts">
	import QueryService from '$lib/services/query.service';
	import socket from '$lib/services/socket.service';
	import { faFloppyDisk, faPencil, faXmark } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { QueryObserver } from '@tanstack/svelte-query';

	export let chatId: String;
	export let name: String;
	export let memberCount: number;
	let value = name;
	let editNameOpen = false;

	let observer = new QueryObserver(QueryService.getQueryClient(), { queryKey: ['chats'] });

	const save = () => {
		if (value !== '') {
			socket.emit('chat-edit', { chatId, name: value }, () => {
				$observer.refetch();
				editNameOpen = false;
			});
		}
	};
</script>

{#if editNameOpen}
	<span class="name">
		<input type="text" bind:value />
		<button class="edit-name action" on:click={save}>
			<FontAwesomeIcon icon={faFloppyDisk} />
		</button>
		<button
			class="edit-name action"
			on:click={() => {
				editNameOpen = false;
				value = name;
			}}
		>
			<FontAwesomeIcon icon={faXmark} />
		</button>
	</span>
	<span class="members-counter">{memberCount} Mitglieder</span>
{:else}
	<span class="name">
		{name}
		<button class="edit-name" on:click={() => (editNameOpen = true)}>
			<FontAwesomeIcon icon={faPencil} />
		</button>
	</span>
	<span class="members-counter">{memberCount} Mitglieder</span>
{/if}
