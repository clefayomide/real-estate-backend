export interface SignUpType {
	username: string;
	password: string;
	email: string;
}

export interface UserObjectType extends Omit<SignUpType, "password"> {
	id: number;
	hash: string;
	salt: string;
	verified: boolean | null;
	createdAt: Date;
	updatedAt: Date;
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

export type getUserType = { email: string } | { id: number };
