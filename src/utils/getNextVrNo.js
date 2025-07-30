const getNextVrNo = (headers) => {
	if (!headers) return;
	if (headers.length === 0) return 1;
	const VrNo = 999000000 + Math.floor(Math.random() * 100000);
	return VrNo;
};
export default getNextVrNo;
