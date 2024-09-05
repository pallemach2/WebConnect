import type { User } from '$lib/types/prisma';
import { writable } from 'svelte/store';

export const users = writable<User[]>([]);
