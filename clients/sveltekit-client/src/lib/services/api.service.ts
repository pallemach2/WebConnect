/* eslint-disable @typescript-eslint/no-this-alias */
// Custom imports
import RequestService from './request.service';

declare global {
	interface Date {
		format(format: string): string;
	}
}

Date.prototype.format = function (format) {
	const date = this;
	return format.replace(/(yyyy|mm|dd|hh|MM|ss|Z)/gi, (key) => {
		switch (key) {
			case 'yyyy':
				return date.getFullYear().toString();
			case 'mm': {
				let x = (date.getMonth() + 1).toString();
				x = x.length === 1 ? '0' + x : x;
				return x;
			}
			case 'dd': {
				let y = date.getDate().toString();
				y = y.length === 1 ? '0' + y : y;
				return y;
			}
			case 'hh': {
				let z = date.getHours().toString();
				z = z.length === 1 ? '0' + z : z;
				return z;
			}
			case 'MM': {
				let a = date.getMinutes().toString();
				a = a.length === 1 ? '0' + a : a;
				return a;
			}
			case 'ss': {
				let b = date.getSeconds().toString();
				b = b.length === 1 ? '0' + b : b;
				return b;
			}
			case 'Z': {
				const month = date.getMonth();

				switch (month) {
					case 1:
						return 'Januar';
					case 2:
						return 'Februar';
					case 3:
						return 'März';
					case 4:
						return 'April';
					case 5:
						return 'Mai';
					case 6:
						return 'Juni';
					case 7:
						return 'Juli';
					case 8:
						return 'August';
					case 9:
						return 'September';
					case 10:
						return 'Oktober';
					case 11:
						return 'November';
					case 12:
						return 'Dezember';
					default:
						return '';
				}
			}
			default:
				return key;
		}
	});
};

class ApiService {
	/**
	 * Fetch a list of all cahts from the api
	 * @returns
	 */
	static async fetchChats() {
		return RequestService.get('/chat/all');
	}

	/**
	 * Fetch a specific chat by its id from the api
	 * @param chatId
	 * @returns
	 */
	static async fetchChat(chatId: string) {
		return RequestService.get('/chat/' + chatId);
	}

	/**
	 * Fetch all messages starting from a cursor from a specific chat from the api
	 * @param chatId
	 * @param cursor
	 * @returns
	 */
	static async fetchMessages(chatId: string, cursor: string | null = null) {
		if (cursor !== null) {
			return fetch('http://Localhost:4000/api/chat/' + chatId + '/messages/' + cursor);
		} else {
			return fetch('http://Localhost:4000/api/chat/' + chatId + '/messages');
		}
	}

	/**
	 * Do authentication to request api tokens
	 * @param username
	 * @param password
	 * @returns
	 */
	static async doAuthenticate(username: string, password: string) {
		return RequestService.post('/auth/authenticate', {
			username,
			password,
		});
	}

	/**
	 * Do a registration at the api
	 * @param username
	 * @param password
	 * @param email
	 * @returns
	 */
	static async doRegistration(username: string, password: string, email: string) {
		return RequestService.post('/auth/register', {
			username,
			password,
			email,
		});
	}

	/**
	 * Refresh access token
	 * @param token
	 * @param refreshToken
	 * @returns
	 */
	static async doRefresh(token: string, refreshToken: string) {
		return fetch('http://Localhost:4000/api/auth/refresh', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				token,
				refreshToken,
			}),
		});
	}

	/**
	 * Fetch a userlist from the api (only users from own chats)
	 * @returns
	 */
	static async fetchUserList() {
		return RequestService.get('/users/all');
	}

	/**
	 * Do a connection test
	 * @returns
	 */
	static async doPing() {
		return await RequestService.get('/general/ping');
	}

	/**
	 * Request a new password
	 * @param input
	 * @returns
	 */
	static async doPasswordForgot(input: string) {
		return await RequestService.post('/auth/password/forgot', {
			input,
		});
	}

	/**
	 * Change group avatar
	 * @param input
	 * @returns
	 */
	static async changeGroupAvatar(chatId: string, file: unknown) {
		return await RequestService.postFileUpload('/chat/' + chatId + '/avatar', file);
	}

	/**
	 * Set a new password after forgot
	 * @param code
	 * @param password
	 * @returns
	 */
	static async doPasswordForgotChange(code: string, password: string) {
		return await RequestService.post('/auth/password/forgot/change', {
			code,
			password,
		});
	}
}

export default ApiService;
