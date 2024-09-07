<script lang="ts">
	// Components
	import { faImage } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	// Various
	import ApiService from '$lib/services/api.service';
	import QueryService from '$lib/services/query.service';
	import { createMutation, QueryObserver } from '@tanstack/svelte-query';

	// Props
	export let chatId: string;
	export let src: String;

	// States
	let fileInputElement: HTMLElement | null = null;

	// Register listener to chats query
	let observer = new QueryObserver(QueryService.getQueryClient(), { queryKey: ['chats'] });

	// Avatar upload mutation
	let avatarUpload = createMutation({
		mutationFn: (file: any) => {
			return ApiService.changeGroupAvatar(chatId, file);
		},
		onSuccess: () => {
			$observer.refetch();
		},
		onError: (err) => {
			console.log(err);
		},
	});

	/**
	 * Action if a new file for avatar was selected
	 * @param e
	 */
	const handleFileChange = (e: any) => {
		if (e.target.files) {
			$avatarUpload.mutate(e.target.files[0]);
		}
	};
</script>

<img src={'http://localhost:4000/avatar/' + src} alt="" />
<input id="file" bind:this={fileInputElement} type="file" on:input={handleFileChange} />
<button class="change-avatar" on:click={() => fileInputElement?.click()}>
	<FontAwesomeIcon icon={faImage} />
</button>
