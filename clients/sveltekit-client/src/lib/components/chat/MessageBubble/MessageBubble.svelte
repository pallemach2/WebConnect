<script lang="ts">
	// Style
	import './MessageBubble.scss';

	// Components
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faCheck, faCheckDouble, faPencil } from '@fortawesome/free-solid-svg-icons';
	import MessageContextMenu from '../MessageContextMenu/MessageContextMenu.svelte';

	// Various
	import { browser } from '$app/environment';
	import TokenService from '$lib/services/token.service';
	import type { ChatParticipant, Message } from '$lib/types/prisma';
	import { doubleTick } from '$lib/services/util.service';

	// Props
	export let message: Message;
	export let nextMessage: Message;
	export let previousMessage: Message;
	export let participants: ChatParticipant[];
	export let component: any;

	// States
	let contextMenuPosition = { x: 0, y: 0 };
	let contextMenu = false;
	let user = null;
	let self = false;
	let sameDayAsPrevious = true;
	let sameDayAsAfter = true;
	let nextImmediate = false;
	let previousImmediate = false;
	let nextIsSameCreator = false;
	let previousIsSameCreator = false;
	let doubleTickFlag = false;

	// Set basic parameters every render
	$: if (browser) {
		user = TokenService.getUser();
		self = message.ChatParticipant.User.id === user.id;

		if (previousMessage) {
			sameDayAsPrevious =
				new Date(previousMessage.createdAt).format('dd.mm.yyyy') === new Date(message.createdAt).format('dd.mm.yyyy');
		}

		// Check if message date is at the same day as the message after
		if (nextMessage) {
			sameDayAsAfter =
				new Date(nextMessage.createdAt).format('dd.mm.yyyy') === new Date(message.createdAt).format('dd.mm.yyyy');
		}

		// Check if next message is within 60 seconds
		if (sameDayAsAfter && nextMessage) {
			nextImmediate = new Date(nextMessage.createdAt).getTime() - new Date(message.createdAt).getTime() < 60000;
		}

		// Check if next message is within 60 seconds
		if (sameDayAsPrevious && previousMessage) {
			previousImmediate = new Date(message.createdAt).getTime() - new Date(previousMessage.createdAt).getTime() < 60000;
		}

		// Check if next message is from same creator
		if (nextMessage) {
			nextIsSameCreator = nextMessage.ChatParticipant.User.id === message.ChatParticipant.User.id;
		}

		// Check if next message is from same creator
		if (previousMessage) {
			previousIsSameCreator = previousMessage.ChatParticipant.User.id === message.ChatParticipant.User.id;
		}
	}

	// Set doubletick after every message or participants change
	$: doubleTickFlag = doubleTick(message, participants);
</script>

{#if !sameDayAsPrevious}
	<div class="date-divider">
		<span>{new Date(message.createdAt).format('dd. Z yyyy')}</span>
	</div>
{/if}
<div class="message-container {self && 'self'}" bind:this={component}>
	<div
		class="message-bubble {nextImmediate && nextIsSameCreator && 'nextImmediate'} {previousImmediate &&
			previousIsSameCreator &&
			'previousImmediate'}"
		on:contextmenu|preventDefault={(e) => {
			contextMenuPosition = { x: e.pageX, y: e.pageY };
			contextMenu = true;
		}}
	>
		<div class="content-container">
			{#if (!previousIsSameCreator || !previousImmediate) && !self && participants.length > 2}
				<span class="creator">
					{message.ChatParticipant.User.username}
				</span>
			{/if}
			<span>{message.content}</span>
		</div>
		<div class="message-details">
			<div class="message-flags">
				{#if message.edited}
					<FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
				{/if}
				{#if self}
					<FontAwesomeIcon icon={doubleTickFlag ? faCheckDouble : faCheck}></FontAwesomeIcon>
				{/if}
			</div>
			<span class="message-timestamp">
				{new Date(message.createdAt).format('hh:MM')}
			</span>
		</div>
	</div>
</div>
{#if contextMenu}
	<MessageContextMenu
		close={() => (contextMenu = false)}
		position={contextMenuPosition}
		{message}
		participantsCounter={participants.length}
	/>
{/if}
{#if !nextImmediate && sameDayAsAfter && nextMessage}
	<div class="message-spacer"></div>
{/if}
