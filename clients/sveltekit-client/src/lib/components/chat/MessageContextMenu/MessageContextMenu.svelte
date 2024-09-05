<script lang="ts">
	import type { Message } from '$lib/types/prisma';
	import { QueryObserver } from '@tanstack/svelte-query';
	import './MessageContextMenu.scss';
	import QueryService from '$lib/services/query.service';
	import { browser } from '$app/environment';
	import ReadBy from './ReadBy.svelte';
	import ButtonInput from '$lib/components/form/ButtonInput/ButtonInput.svelte';
	import TokenService from '$lib/services/token.service';
	import socket from '$lib/services/socket.service';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faCopy, faPaperPlane, faPencil, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
	import EditMenu from '../EditMenu/EditMenu.svelte';

	export let close: () => void;
	export let message: Message;
	export let participantsCounter: number;
	export let position: { x: number; y: number };
	let editMenu = false;
	let component: HTMLElement | null = null;
	let user = null;
	let self = null;
	let x = -10000;
	let y = -10000;
	let innerWidth = 0;
	let innerHeight = 0;

	let observer = new QueryObserver(QueryService.getQueryClient(), { queryKey: ['chats'] });

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

	const closeAction = (e: any) => {
		if (e.target.classList.contains('message-context-menu-bg')) close();
	};

	const copyAction = () => {
		navigator.clipboard.writeText(message.content);
		close();
	};

	const editAction = () => {
		console.log('test');
		editMenu = true;
	};

	const deleteAction = () => {
		const res = confirm('Sicher das Sie die Nachricht löschen wollen?');

		if (res) {
			socket.emit('message-delete', { messageId: message.id }, () => {
				// TODO: implement message without refetching
				$observer.refetch();
				close();
			});
		}
	};

	if (browser) {
		user = TokenService.getUser();
		self = message.ChatParticipant.User.id === user.id;
	}

	$: {
		if (component) {
			const containerHeight = component.offsetHeight || 0;
			const containerWidth = component.offsetWidth || 0;

			x = position.x;
			if (position.x + containerWidth > innerWidth) x = position.x - containerWidth;

			y = position.y;
			if (position.y + containerHeight > innerHeight) y = position.y - containerHeight;

			y = y;
			x = x;
		}
	}

	$: console.log(editMenu);
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<div class="message-context-menu-bg" on:click={closeAction}>
	<div bind:this={component} class="message-context-menu" style:left="{x}px" style:top="{y}px">
		<div class="edited-container">
			<FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
			<span class="edited-text">
				{getReadableDate(message.createdAt, 'dd.mm.yyyy um hh:MM')}
			</span>
		</div>
		{#if self}
			<ReadBy messageSeen={message.MessageSeen} {participantsCounter} />
		{/if}
		{#if message.edited}
			<div class="edited-container">
				<FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
				<span class="edited-text">
					{getReadableDate(message.updatedAt, 'dd.mm.yyyy um hh:MM')}
				</span>
			</div>
		{/if}
		<div class="actions-container">
			{#if self}
				<ButtonInput type="secondary" onClick={editAction}>
					<FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>
					bearbeiten
				</ButtonInput>
			{/if}
			<ButtonInput type="secondary" onClick={copyAction}>
				<FontAwesomeIcon icon={faCopy}></FontAwesomeIcon>
				kopieren
			</ButtonInput>
			{#if self}
				<ButtonInput type="secondary" onClick={deleteAction}>
					<FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
					löschen
				</ButtonInput>
			{/if}
		</div>
	</div>
	{#if editMenu}
		<EditMenu {message} close={() => (editMenu = false)} />
	{/if}
</div>
