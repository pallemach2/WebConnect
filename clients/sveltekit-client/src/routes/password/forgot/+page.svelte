<script lang="ts">
	// Styling
	import './+page.scss';

	// Components
	import ButtonInput from '$lib/components/form/ButtonInput/ButtonInput.svelte';
	import MessageBox from '$lib/components/form/MessageBox/MessageBox.svelte';
	import SubmitButtonInput from '$lib/components/form/SubmitButtonInput/SubmitButtonInput.svelte';
	import TextInput from '$lib/components/form/TextInput/TextInput.svelte';
	import Logo from '$lib/components/general/Logo/Logo.svelte';

	// Various
	import { createMutation } from '@tanstack/svelte-query';
	import ApiService from '$lib/services/api.service';
	import { goto } from '$app/navigation';
	import messages from '$lib/assets/messages';
	import type { MessageBoxData } from '$lib/types/MessageBoxData';

	// States
	let input = '';
	let messageBoxData: MessageBoxData = {
		type: 'success',
		message: '',
	};

	// Do Password forgot
	const passwordForgot = createMutation({
		mutationFn: () => {
			return ApiService.doPasswordForgot(input);
		},
		onSuccess: () => {
			// Redirect to chat page
			goto('/signin?passwordForgotComplete=true');
		},
		onError: (err) => {
			// Display MessageBox
			messageBoxData = {
				type: 'error',
				message: messages.getMessage(err.message) || messages.getMessage('client.errors.password.reset'),
			};
		},
	});
</script>

<div class="container">
	<div class="password-forgot-container">
		<Logo />
		<h2>Passwort vergessen</h2>
		<MessageBox type={messageBoxData.type} message={messageBoxData.message} />
		<form class="password-forgot-form" on:submit|preventDefault={() => $passwordForgot.mutate()}>
			<TextInput bind:value={input} label="Benutzername oder E-Mail" required />
			<SubmitButtonInput type="primary" label="Passwort zurücksetzen" loading={$passwordForgot.isPending} />
		</form>
		<ButtonInput type="secondary" label="Zurück zur Anmeldung" onClick={() => goto('/signin')} />
	</div>
</div>
