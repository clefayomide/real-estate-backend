export interface SignUpType {
	username: string;
	password: string;
	email: string;
}

export interface UserObjectType extends Omit<SignUpType, "password"> {
	[key: string]: any;
}

interface RequestResponseI {
	status: boolean;
	code: number;
	message: string;
}

export interface ErrorType extends RequestResponseI {
	error?: String[];
}

export interface SuccessType extends RequestResponseI {
	data?: any;
}
