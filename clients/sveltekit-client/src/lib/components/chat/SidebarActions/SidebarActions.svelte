<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import './SidebarActions.scss';
	import { faGear, faPlus } from '@fortawesome/free-solid-svg-icons';
	import { createEventDispatcher } from 'svelte';

	let newChatMenu = false;
	let settingsMenu = false;

	const dispatch = createEventDispatcher();

	function closeMenu() {
		newChatMenu = false;
		settingsMenu = false;
	}

	// Handle the click
	function handleChange(event: Event) {
		const { target } = event;
		if (target) dispatch('search', { term: (target as HTMLInputElement).value });
	}
</script>

<div class="sidebar-actions-container">
	<input type="text" placeholder="Suche" on:input={handleChange} />
	<button class="action" on:click={() => (newChatMenu = true)}>
		<FontAwesomeIcon icon={faPlus} />
	</button>
	<button class="action" on:click={() => (settingsMenu = true)}>
		<FontAwesomeIcon icon={faGear} />
	</button>
	{#if settingsMenu || newChatMenu}
		<div class="sidebar-actions-menu-bg" on:click={closeMenu}>
			{#if settingsMenu}<div></div>{/if}
			<!-- {#if newChatMenu}<NewChatMenu close={closeMenu} />{/if} -->
		</div>
	{/if}
</div>
