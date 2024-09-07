<script lang="ts">
	// Styling
	import './+page.scss';

	// Components
	import TextInput from '$lib/components/form/TextInput/TextInput.svelte';
	import Logo from '$lib/components/general/Logo/Logo.svelte';
	import SubmitButtonInput from '$lib/components/form/SubmitButtonInput/SubmitButtonInput.svelte';
	import ButtonInput from '$lib/components/form/ButtonInput/ButtonInput.svelte';
	import MessageBox from '$lib/components/form/MessageBox/MessageBox.svelte';

	// Various
	import { goto } from '$app/navigation';
	import { createMutation } from '@tanstack/svelte-query';
	import TokenService from '$lib/services/token.service';
	import ApiService from '$lib/services/api.service';
	import messages from '$lib/assets/messages';
	import { browser } from '$app/environment';

	// Redirect if already logged in
	if (browser) {
		if (TokenService.getLocalToken()) {
			goto('/chat');
		}
	}

	// States
	let username = '';
	let password = '';
	let passwordRepeat = '';
	let email = '';
	let messageBoxData: {
		type: 'success' | 'error' | 'warning';
		message: string;
	} = {
		type: 'success',
		message: '',
	};

	// Do login
	const register = createMutation({
		mutationFn: () => {
			if (password !== passwordRepeat) throw new Error('client.errors.authentication.passwordDoNMotMatch');
			return ApiService.doRegistration(username, password, email);
		},
		onSuccess: () => {
			// Redirect to chat page
			goto('/signin?registrationComplete=true');
		},
		onError: (err) => {
			// Display MessageBox
			messageBoxData = {
				type: 'error',
				message: messages.getMessage(err.message) || messages.getMessage('client.errors.registration'),
			};
		},
	});
</script>

<div class="container">
	<div class="signup-container">
		<Logo />
		<h2>Registrierung</h2>
		<MessageBox type={messageBoxData.type} message={messageBoxData.message} />
		<form class="signup-form" on:submit|preventDefault={() => $register.mutate()}>
			<TextInput bind:value={username} label="Benutzername" required />
			<TextInput bind:value={email} label="E-Mail" required />
			<TextInput
				bind:value={password}
				label="Passwort"
				subLabel="Mind. 8 Zeichen, Buchstaben, Ziffer und Sonderzeichen"
				type="password"
				required
			/>
			<TextInput bind:value={passwordRepeat} label="Passwort wiederholen" type="password" required />
			<SubmitButtonInput type="primary" label="Registrieren" loading={$register.isPending} />
		</form>
		<ButtonInput type="secondary" label="Zurück zur Anmeldung" onClick={() => goto('/signin')} />
	</div>
</div>
