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
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import messages from '$lib/assets/messages';
	import ApiService from '$lib/services/api.service';
	import { createMutation } from '@tanstack/svelte-query';
	import type { MessageBoxData } from '$lib/types/MessageBoxData';

	// States
	let password = '';
	let passwordRepeat = '';
	let messageBoxData: MessageBoxData = {
		type: 'success',
		message: '',
	};

	// Do Password reset
	const passwordReset = createMutation({
		mutationFn: () => {
			if (password !== passwordRepeat) throw new Error('client.errors.authentication.passwordDoNMotMatch');
			return ApiService.doPasswordForgotChange($page.url.searchParams.get('code') || '', password);
		},
		onSuccess: () => {
			// Redirect to chat page
			goto('/signin?passwordResetComplete=true');
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
	<div class="password-reset-container">
		<Logo />
		<h2>Passwort ändern</h2>
		<MessageBox type={messageBoxData.type} message={messageBoxData.message} />
		<form class="password-reset-form" on:submit|preventDefault={() => $passwordReset.mutate()}>
			<TextInput
				bind:value={password}
				type="password"
				label="Passwort"
				subLabel="Mind. 8 Zeichen, Buchstaben, Ziffer und Sonderzeichen"
				required
			/>
			<TextInput bind:value={passwordRepeat} type="password" label="Passwort wiederholen" required />
			<SubmitButtonInput type="primary" label="Passwort ändern" loading={$passwordReset.isPending} />
		</form>
		<ButtonInput type="secondary" label="Zurück zur Anmeldung" onClick={() => goto('/signin')} />
	</div>
</div>
