export const generateOTP = () => {
	const digits = "0123456789";
	let otp = "";
	const len = digits.length;
	for (let i = 0; i < 6; i++) {
		otp += digits[Math.floor(Math.random() * len)];
	}

	return otp;
};
