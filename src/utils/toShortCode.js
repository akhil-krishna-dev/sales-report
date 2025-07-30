const toShortCode = (number, digits = 5) => {
	const hash = number
		.toString()
		.split("")
		.reduce((acc, digit) => {
			return acc + parseInt(digit);
		}, 0);
	return hash % 10 ** digits;
};

export default toShortCode;
