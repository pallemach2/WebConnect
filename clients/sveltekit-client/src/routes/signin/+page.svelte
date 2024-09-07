<script lang="ts">
	// Styling
	import './+page.scss';

	// Components
	import TextInput from '$lib/components/form/TextInput/TextInput.svelte';
	import Logo from '$lib/components/general/Logo/Logo.svelte';
	import CheckboxInput from '$lib/components/form/CheckboxInput/CheckboxInput.svelte';
	import SubmitButtonInput from '$lib/components/form/SubmitButtonInput/SubmitButtonInput.svelte';
	import ButtonInput from '$lib/components/form/ButtonInput/ButtonInput.svelte';
	import MessageBox from '$lib/components/form/MessageBox/MessageBox.svelte';

	// Various
	import { goto } from '$app/navigation';
	import { createMutation } from '@tanstack/svelte-query';
	import TokenService from '$lib/services/token.service';
	import ApiService from '$lib/services/api.service';
	import { page } from '$app/stores';
	import messages from '$lib/assets/messages';
	import { browser } from '$app/environment';
	import type { MessageBoxData } from '$lib/types/MessageBoxData';

	// Redirect if already logged in
	if (browser) {
		if (TokenService.getLocalToken()) {
			goto('/chat');
		}
	}

	// States
	let username = '';
	let password = '';
	let rememberMe = false;
	let messageBoxData: MessageBoxData = {
		type: 'success',
		message: '',
	};

	// Set initial message box content
	if ($page.url.searchParams.get('registrationComplete'))
		messageBoxData.message = 'Erfolgreich registriert. Melden Sie sich jetzt an!';

	if ($page.url.searchParams.get('passwordForgotComplete'))
		messageBoxData.message = 'Eine Link zum Passwort zurücksetzen wurde an Ihre Email-Adresse geschickt.';

	if ($page.url.searchParams.get('passwordResetComplete'))
		messageBoxData.message = 'Ihr Passwort wurde erfolgreich geändert, melden Sie sich jetzt an.';

	// Do login
	const login = createMutation({
		mutationFn: () => {
			return ApiService.doAuthenticate(username, password);
		},
		onSuccess: (data: any) => {
			// Save tokens
			TokenService.updateUser({
				id: data.userId,
				username: data.username,
				avatar: data.avatar,
			});
			TokenService.updateLocalToken(data.token, data.tokenExpire, rememberMe);
			TokenService.updateLocalRefreshToken(data.refreshToken, data.refreshTokenExpire, rememberMe);

			// Redirect to chat page
			goto('/chat');
		},
		onError: (err) => {
			// Display MessageBox
			messageBoxData = {
				type: 'error',
				message: messages.getMessage(err.message) || messages.getMessage('client.errors.authentication'),
			};
		},
	});
</script>

<div class="container">
	<div class="signin-container">
		<Logo />
		<h2>Anmeldung</h2>
		<MessageBox type={messageBoxData.type} message={messageBoxData.message} />
		<form class="signin-form" on:submit|preventDefault={() => $login.mutate()}>
			<TextInput bind:value={username} label="Benutzername" required />
			<TextInput bind:value={password} label="Passwort" type="password" required />
			<CheckboxInput bind:value={rememberMe} label="Angemeldet bleiben" />
			<SubmitButtonInput type="primary" label="Anmelden" loading={$login.isPending} />
		</form>
		<div class="action-container">
			<ButtonInput type="secondary" label="Registrieren" onClick={() => goto('/signup')} />
			<ButtonInput type="secondary" label="Passwort vergessen" onClick={() => goto('/password/forgot')} />
		</div>
	</div>
</div>
