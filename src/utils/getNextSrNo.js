const getNextSrNo = (detail) => {
	if (!detail) return;
	if (detail.length === 0) return 1;
	const maxVrNo = Math.max(...detail.map((d) => d.sr_no));
	return maxVrNo + 1;
};
export default getNextSrNo;
