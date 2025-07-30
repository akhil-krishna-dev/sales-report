import { useDispatch, useSelector } from "react-redux";
import "./AllTransactions.css";
import formatTimestamp from "../../../utils/formatTimestamp";
import { updateCurrentHeader } from "../../../store/slices/transactionsSlices";
import { updateShowTransactionDetail } from "../../../store/slices/appControlSlices";
import ActionButtons from "./ActionButtons";

function AllTransactions() {
	const dispatch = useDispatch();
	const header = useSelector((state) => state.transactions.header.allHeader);

	const handleOnSelectHeader = (selectedHeader) => {
		dispatch(updateCurrentHeader(selectedHeader));
		dispatch(updateShowTransactionDetail(true));
	};
	return (
		<>
			<div className="header-list-container">
				<div className="title-container">
					<h1>All Transactions</h1>
				</div>
				<div className="header-container">
					<table>
						<thead>
							<tr>
								<th>Vr No</th>
								<th>Vr Date</th>
								<th>Ac Name</th>
								<th>Ac Amount</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{header.length
								? header.map((h, index) => (
										<tr
											onClick={() =>
												handleOnSelectHeader(h)
											}
											className="header-row"
											key={index}
										>
											<td>{h.vr_no}</td>
											<td>
												{formatTimestamp(h.vr_date)}
											</td>
											<td>{h.ac_name}</td>
											<td>{h.ac_amt}</td>
											<td>{h.status}</td>
										</tr>
								  ))
								: null}
						</tbody>
					</table>
				</div>
			</div>
			<ActionButtons />
		</>
	);
}

export default AllTransactions;
