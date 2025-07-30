const formatTimestamp = (timestamp) => {
	if (timestamp) {
		return new Date(timestamp).toDateString();
	}
	return new Date().toDateString();
};

export default formatTimestamp;
