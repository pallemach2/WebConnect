<script lang="ts">
	// Styling
	import './ChatWindow.scss';

	// Components
	import ChatHeader from '../ChatHeader/ChatHeader.svelte';
	import ChatHistory from '../ChatHistory/ChatHistory.svelte';
	import NewMessageBar from '../NewMessageBar/NewMessageBar.svelte';
</script>

<div class="chat-window-container">
	<ChatHeader />
	<ChatHistory />
	<NewMessageBar />
</div>
