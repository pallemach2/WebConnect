import type { Chat } from '$lib/types/prisma';
import { writable } from 'svelte/store';

export const chats = writable<Chat[]>([]);
