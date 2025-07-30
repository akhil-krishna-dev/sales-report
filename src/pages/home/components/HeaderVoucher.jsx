import { useDispatch, useSelector } from "react-redux";
import "./HeaderVoucher.css";
import getNextVrNo from "../../../utils/getNextVrNo";
import {
	updateNewVoucherDate,
	updateNewVoucherNumber,
} from "../../../store/slices/transactionsSlices";
import { useEffect } from "react";
import formatTimestamp from "../../../utils/formatTimestamp";

function HeaderVoucher({ currentHeader, onChageInput, totalAmount }) {
	const dispatch = useDispatch();
	const isAddingNewDetail = useSelector(
		(state) => state.transactions.detail.isAddingNew
	);
	const allHeaders = useSelector(
		(state) => state.transactions.header.allHeader
	);
	const voucherNo = useSelector(
		(state) => state.transactions.header.newHeader.voucherNo
	);
	const voucherDate = useSelector(
		(state) => state.transactions.header.newHeader.voucherDate
	);

	if (!currentHeader && !isAddingNewDetail) return;

	useEffect(() => {
		dispatch(updateNewVoucherNumber(getNextVrNo(allHeaders)));
		dispatch(updateNewVoucherDate("2025-07-01"));
	}, [currentHeader]);

	const renderInput = (text) => {
		if (isAddingNewDetail) {
			if (text === "vr_no") {
				return <span className="box">{voucherNo}</span>;
			} else if (text === "status") {
				return (
					<select onChange={onChageInput} name="status" id="status">
						<option value="A" label="Active" />
						<option value="I" label="Inactive" />
					</select>
				);
			}
			return (
				<input
					onChange={onChageInput}
					className="current-header-input"
					id={text}
					type="text"
					name={text}
				/>
			);
		}
		return <span className="box">{currentHeader?.[text]}</span>;
	};

	return (
		<div className="header-container">
			<div className="header">
				<h3>Header</h3>
			</div>
			<div className="header-details-container">
				<div className="top-section">
					<div className="voucher-no text-box-container">
						Vr No {renderInput("vr_no")}
					</div>
					<div className="voucher-date text-box-container">
						Vr Date <span className="box">{voucherDate}</span>
					</div>
					<div className="status text-box-container">
						Status {renderInput("status")}
					</div>
				</div>
				<div className="bottom-section">
					<div className="account-name text-box-container">
						Ac Name {renderInput("ac_name")}
					</div>
					<div className="account-amount">
						Ac Amount <span className="box">{totalAmount}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default HeaderVoucher;
