import type { Chat, ChatParticipant, Message, User } from '$lib/types/prisma';

/**
 * Generate a readable timestamp
 * @param date
 */
export function getTimestamp(date = new Date()) {
	return new Date(date).getTime();
}

/**
 * Get a readable string from a date
 * @param date
 * @param format
 * @returns
 */
export function getReadableDate(date = new Date(), format = 'hh:MM') {
	const dateObj = new Date(date);

	if (
		dateObj.getDay() !== new Date().getDay() ||
		dateObj.getMonth() !== new Date().getMonth() ||
		dateObj.getFullYear() !== new Date().getFullYear()
	) {
		return new Date(date).format('dd.mm.yyyy um hh:MM');
	}
	return new Date(date).format(format);
}

/**
 * Returns list of chats in right order with search term applied
 * @returns
 */
export function getChatsList(data: Chat[], searchTerm: string) {
	// Return all chats ordered by timestamp of last message
	if (searchTerm === '') {
		return (data as Chat[]).toSorted((c1, c2) => {
			const c1Value = c1.Message.length > 0 ? c1.Message[0].createdAt : c1.createdAt;
			const c2Value = c2.Message.length > 0 ? c2.Message[0].createdAt : c2.createdAt;

			return new Date(c2Value).getTime() - new Date(c1Value).getTime();
		});
	}

	const results: Chat[] = [];
	const regex = new RegExp(searchTerm, 'gi');

	(data as Chat[]).forEach((chat) => {
		if (regex.test(chat.name || '')) {
			results.push(chat);
			return;
		}

		chat.ChatParticipant.forEach((cp) => {
			if (regex.test(cp.User.username)) {
				results.push(chat);
				return;
			}
		});
	});

	return results;
}

/**
 * Checks if all users have read a message
 * @param message
 * @param chatParticipants
 * @returns boolean
 */
export function doubleTick(message: Message, chatParticipants: ChatParticipant[]) {
	return message.MessageSeen.length >= chatParticipants.length;
}

/**
 * Check how many unread messages the user has in chat
 * @param messages
 * @param userId
 * @returns number
 */
export function getUnreadCounter(messages: Message[], userId: string) {
	let unread = 0;

	// Iterate over every message and its message seen entries and check if seen
	messages.forEach((message) => {
		const i = message.MessageSeen.findIndex((entry) => entry.ChatParticipant.userId === userId);
		if (i === -1) unread += 1;
	});

	return unread;
}

/**
 * Scroll to element
 * @param element
 */
export function scrollToMessage(element: HTMLElement) {
	if (element) {
		element.scrollIntoView();
	}
}

/**
 * Returns a list of all users with their details, based on Participant input
 * @param cp
 * @returns
 */
export function getUsersMetaByParticipants(cp: ChatParticipant[], userList: User[]) {
	const foundUsers: User[] = [];

	cp.forEach((p) => {
		if (p.User) {
			const foundUser = userList.find((u) => u.id === p.User.id);

			if (foundUser) foundUsers.push(foundUser);
		}
	});

	return foundUsers;
}
