// This file was auto-generated by prisma-generator-typescript-interfaces

export interface User {
	id: string;
	email: string;
	username: string;
	password: string;
	active: boolean;
	lastSeen: Date | null;
	avatar: string | null;
	createdAt: Date;
	updatedAt: Date;
	Session?: Session[];
	PasswordForgot?: PasswordForgot | null;
	UserSettings?: UserSettings[];
	ChatParticipant?: ChatParticipant[];
	online?: boolean;
}

export interface UserSettings {
	id: string;
	User?: User;
	userId: string;
	showLastSeen: boolean;
	showOnline: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface Session {
	id: string;
	User?: User;
	userId: string;
	token: string;
	tokenExpire: Date;
	refreshToken: string;
	refreshTokenExpire: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface PasswordForgot {
	id: string;
	User?: User;
	userId: string;
	validUntil: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface Chat {
	id: string;
	active: boolean;
	avatar: string | null;
	name: string | null;
	createdAt: Date;
	updatedAt: Date;
	ChatParticipant: ChatParticipant[];
	Message: Message[];
}

export interface ChatParticipant {
	id: string;
	User: User;
	userId: string;
	Chat?: Chat;
	chatId: string;
	creator: boolean;
	admin: boolean;
	createdAt: Date;
	updatedAt: Date;
	Message?: Message[];
	MessageSeen?: MessageSeen[];
}

export interface Message {
	id: string;
	Chat?: Chat;
	chatId: string;
	ChatParticipant: ChatParticipant;
	chatParticipantId: string;
	content: string;
	edited: boolean;
	image: string | null;
	createdAt: Date;
	updatedAt: Date;
	MessageSeen: MessageSeen[];
}

export interface MessageSeen {
	id: string;
	ChatParticipant: ChatParticipant;
	chatParticipantId: string;
	Message?: Message;
	messageId: string;
	timestamp: Date;
}

export interface Test {
	id: string;
}
