<script lang="ts">
	import ChatHeader from '../ChatHeader/ChatHeader.svelte';
	import ChatHistory from '../ChatHistory/ChatHistory.svelte';
	import NewMessageBar from '../NewMessageBar/NewMessageBar.svelte';
	import './ChatWindow.scss';
</script>

<div class="chat-window-container">
	<ChatHeader />
	<ChatHistory />
	<NewMessageBar />
</div>
