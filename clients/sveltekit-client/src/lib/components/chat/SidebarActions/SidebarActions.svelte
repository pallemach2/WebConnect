<script lang="ts">
	// Styling
	import './SidebarActions.scss';

	// Components
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faGear, faPlus } from '@fortawesome/free-solid-svg-icons';
	import NewChatMenu from '../NewChatMenu/NewChatMenu.svelte';

	// Props
	export let searchTerm: string;

	// States
	let newChatMenu = false;
	let settingsMenu = false;

	/**
	 * Close all menus
	 */
	function closeMenu() {
		newChatMenu = false;
		settingsMenu = false;
	}
</script>

<div class="sidebar-actions-container">
	<input type="text" placeholder="Suche" bind:value={searchTerm} />
	<button class="action" on:click={() => (newChatMenu = true)}>
		<FontAwesomeIcon icon={faPlus} />
	</button>
	<button class="action" on:click={() => (settingsMenu = true)}>
		<FontAwesomeIcon icon={faGear} />
	</button>
	{#if settingsMenu || newChatMenu}
		<div class="sidebar-actions-menu-bg" on:click={closeMenu}>
			{#if settingsMenu}<div></div>{/if}
			{#if newChatMenu}<NewChatMenu close={closeMenu} />{/if}
		</div>
	{/if}
</div>
