<script lang="ts">
	import './+page.scss';
	import Sidebar from '$lib/components/chat/Sidebar/Sidebar.svelte';
	import UserStoreProvider from '$lib/components/general/UserStoreProvider/UserStoreProvider.svelte';
	import ChatStoreProvider from '$lib/components/general/ChatStoreProvider/ChatStoreProvider.svelte';
	import ChatWindow from '$lib/components/chat/ChatWindow/ChatWindow.svelte';
</script>

<div class="chat-container">
	<UserStoreProvider>
		<ChatStoreProvider>
			<Sidebar />
			<ChatWindow />
		</ChatStoreProvider>
	</UserStoreProvider>
</div>
