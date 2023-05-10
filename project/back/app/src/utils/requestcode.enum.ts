export enum FriendCode {
	SUCCESS = 0,
	UNEXISTING_USER = 1,
	NEW_FRIEND = 2,
	ALREADY_FRIEND = 3,
	FRIEND_REQUEST = 4,
	FRIEND_REQUEST_ACCEPTED = 5,
	UNAUTHORIZED = 401
}

export enum messageCode {
	SUCCESS = 0,
	UNEXISTING_CHANNEL = 1,
	UNACCESSIBLE_CHANNEL = 2,
	INVALID_FORMAT = 3,
	UNAUTHORIZED = 401,
}