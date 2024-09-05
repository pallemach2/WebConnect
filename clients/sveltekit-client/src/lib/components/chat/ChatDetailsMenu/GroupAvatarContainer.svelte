<script lang="ts">
	import ApiService from '$lib/services/api.service';
	import QueryService from '$lib/services/query.service';
	import { faImage } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { createMutation, QueryObserver } from '@tanstack/svelte-query';

	export let chatId: string;
	export let src: String;

	let observer = new QueryObserver(QueryService.getQueryClient(), { queryKey: ['chats'] });
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

	const handleFileChange = (e: any) => {
		if (e.target.files) {
			$avatarUpload.mutate(e.target.files[0]);
		}
	};

	const triggerFileSelect = () => {
		document.getElementById('file')?.click();
	};
</script>

<img src={'http://localhost:4000/avatar/' + src} alt="" />
<input id="file" type="file" on:input={handleFileChange} />
<button class="change-avatar" on:click={triggerFileSelect}>
	<FontAwesomeIcon icon={faImage} />
</button>
