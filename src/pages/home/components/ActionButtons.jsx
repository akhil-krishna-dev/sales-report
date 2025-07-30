import { useDispatch } from "react-redux";
import "./ActionButtons.css";
import { updateIsAddingNewDetail } from "../../../store/slices/transactionsSlices";
import { updateShowTransactionDetail } from "../../../store/slices/appControlSlices";

function ActionButtons() {
	const dispatch = useDispatch();

	const handleOnShowTransactionDetail = () => {
		dispatch(updateIsAddingNewDetail(true));
		dispatch(updateShowTransactionDetail(true));
	};

	return (
		/* action buttons section starts */
		<div className="action-buttons-container">
			<button
				onClick={handleOnShowTransactionDetail}
				className="new-record"
			>
				New transaction
			</button>

			{/* <button onClick={handleOnDeleteClick} className="delete-record">
				{isDeletingTransaction ? "Cancel Deleting" : "Delete"}
			</button> */}
		</div>
	);
}

export default ActionButtons;
