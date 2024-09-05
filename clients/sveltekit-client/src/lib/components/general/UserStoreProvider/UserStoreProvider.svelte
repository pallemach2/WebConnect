<script lang="ts">
	import { browser } from '$app/environment';
	import ApiService from '$lib/services/api.service';
	import socket from '$lib/services/socket.service';
	import { users } from '$lib/stores/UserStore';
	import type { User } from '$lib/types/prisma';
	import { createQuery } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';

	function getTimestamp(date = new Date()) {
		return new Date(date).getTime();
	}

	const usersQuery = createQuery({
		queryKey: ['users'],
		queryFn: ApiService.fetchUserList,
		placeholderData: [],
		retry: 2,
	});

	let timeout: number | null;

	let userList: User[] = [];
	users.subscribe((value) => (userList = value));

	// Save users after new request
	$: {
		if ($usersQuery.status === 'success') {
			let data: User[] = [];

			$usersQuery.data.forEach((u: User) => {
				data.push({
					...u,
					online: u.lastSeen ? getTimestamp() - getTimestamp(u.lastSeen) < 2000 : false,
				});
			});

			users.set(data);
		}
	}

	// Start a timeout, to check if user still online
	$: {
		if (browser) {
			if (timeout) clearTimeout(timeout);

			timeout = setTimeout(() => {
				console.log('interval');
				let updatedUsers = userList;
				let update = false;

				updatedUsers.forEach((u, key) => {
					if (u.online) {
						update = true;
						updatedUsers[key].online = updatedUsers[key].lastSeen
							? getTimestamp() - getTimestamp(updatedUsers[key].lastSeen) < 2000
							: false;
					}
				});

				if (update) users.set(updatedUsers);
			}, 5000);
		}
	}

	// Connect on mount
	onMount(() => {
		// Only update lastSeen timestamp when user-online message arrives
		socket.on('user-online', (data: any) => {
			console.log('online msg');
			let index = userList.findIndex((u: any) => u.id === data.userId);

			if (index !== -1) {
				const updatedUsers = userList;
				updatedUsers[index].lastSeen = data.lastSeen;
				updatedUsers[index].online = updatedUsers[index].lastSeen
					? getTimestamp() - getTimestamp(updatedUsers[index].lastSeen) < 2000
					: false;

				users.set(updatedUsers);
			}
		});
		return () => {
			socket.off('user-online');

			if (timeout) {
				clearTimeout(timeout);
			}
		};
	});
</script>

<slot></slot>
