import { useDispatch, useSelector } from "react-redux";
import "./TransactionDetail.css";
import { useEffect, useState } from "react";
import {
	updateShowNewEntryForm,
	updateShowTransactionDetail,
} from "../../../store/slices/appControlSlices";
import PopUp from "../../../components/PopUp";
import TransactionDetailFormFields from "./TransactionDetailFormFields";
import Button from "../../../components/Button";
import {
	updateCurrentHeader,
	updateHeaderWithNewHeader,
	updateIsAddingNewDetail,
	updateNewVoucherDate,
	updateNewVoucherNumber,
	updateSavedDetailWithNewDetail,
	updateUnSavedDetail,
} from "../../../store/slices/transactionsSlices";
import TableRow from "./table/TableRow";
import { url } from "../../../App";
import HeaderVoucher from "./HeaderVoucher";

function TransactionDetail() {
	const dispatch = useDispatch();
	const savedDetail = useSelector((state) => state.transactions.detail.saved);
	const unSavedDetail = useSelector(
		(state) => state.transactions.detail.unSaved
	);
	const [newHeaderData, setNewHeaderData] = useState({
		status: "",
		ac_name: "",
	});
	const [currentDetail, setCurrentDetail] = useState(null);
	const [totalAmount, setTotalAmount] = useState(0);
	const [isUnsavedItems, setIsUnSavedItems] = useState(false);

	const newVoucherNo = useSelector(
		(state) => state.transactions.header.newHeader.voucherNo
	);
	const newVoucherDate = useSelector(
		(state) => state.transactions.header.newHeader.voucherDate
	);
	const currentHeader = useSelector(
		(state) => state.transactions.header.currentHeader
	);
	const showNewEntryForm = useSelector(
		(state) => state.appControl.home.showNewEntryForm
	);
	const isAddingNewDetail = useSelector(
		(state) => state.transactions.detail.isAddingNew
	);

	const [isSavingData, setIsSavingData] = useState(false);

	useEffect(() => {
		if (savedDetail && currentHeader) {
			let totalAmount = 0;
			const { vr_no } = currentHeader;
			const detailList = savedDetail.filter((d) => {
				if (d.vr_no === vr_no) {
					totalAmount += d.qty * d.rate;
					return true;
				}
			});
			setTotalAmount(totalAmount);

			setCurrentDetail(detailList);
		}
	}, []);

	useEffect(() => {
		if (!showNewEntryForm) {
			if (unSavedDetail?.length) {
				const tot = unSavedDetail.reduce((total, currentItem) => {
					return total + currentItem.qty * currentItem.rate;
				}, 0);
				setTotalAmount((prev) => prev + tot);

				setIsUnSavedItems(true);

				setCurrentDetail((prev) => {
					if (prev) {
						return [...prev, ...unSavedDetail];
					}
					return unSavedDetail;
				});
				dispatch(updateUnSavedDetail(false));
			}
		}
	}, [showNewEntryForm]);

	const handleOnCloseTransactionDetail = () => {
		if (isUnsavedItems) {
			alert("You have some unsaved entries related to this transaction!");
			return;
		}
		dispatch(updateCurrentHeader(null));
		dispatch(updateShowTransactionDetail(false));
		dispatch(updateIsAddingNewDetail(false));
	};

	const handleOnPrinting = () => {
		window.print();
	};

	const handleOnShowNewEntryForm = () => {
		dispatch(updateShowNewEntryForm(true));
	};

	const handleOnSubmit = (event) => {
		event.preventDefault();

		const target = event.currentTarget;
		const formData = new FormData(target);
		const data = Object.fromEntries(formData.entries());
		const { qty, rate } = data;
		data.qty = parseInt(qty);
		data.rate = parseInt(rate);
		data.sr_no = currentDetail?.length ? currentDetail.length + 1 : 1;
		data.vr_no = newVoucherNo;
		dispatch(updateUnSavedDetail(data));
		target.reset();
		dispatch(updateShowNewEntryForm(false));
	};

	const handleSaveToDB = async () => {
		if (!isUnsavedItems || isSavingData) return;
		const { status, ac_name } = newHeaderData;

		if (!ac_name) {
			alert("Account name is empty! please type the account name!");
		}
		setIsSavingData(true);
		const headerData = {
			vr_no: newVoucherNo,
			ac_name,
			status: status ? status : "A",
			ac_amt: totalAmount,
			vr_date: newVoucherDate,
		};

		const payload = {
			header_table: headerData,
			detail_table: currentDetail,
		};

		fetch(url + "header/multiple", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res?.error) {
					console.log(res);
				} else {
					dispatch(updateHeaderWithNewHeader(headerData));
					dispatch(updateCurrentHeader(headerData));
					dispatch(updateSavedDetailWithNewDetail(currentDetail));
					dispatch(updateNewVoucherNumber(0));
					dispatch(updateNewVoucherDate(""));
					dispatch(updateIsAddingNewDetail(false));
					setIsUnSavedItems(false);
					alert("This Transaction is saved successfully!");
				}
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setIsSavingData(false);
			});
	};

	const handleOnClickOk = () => {
		dispatch(updateShowNewEntryForm(false));
	};

	const handleOnChageNewHeaderInput = (event) => {
		const { name, value } = event.target;

		setNewHeaderData((prev) => {
			return { ...prev, [name]: value };
		});
	};

	return (
		<>
			{showNewEntryForm ? (
				<PopUp zIndex={1001}>
					<form
						className="transaction-detail-form"
						onSubmit={handleOnSubmit}
					>
						<TransactionDetailFormFields />
						<div className="new-record-save-button-container">
							<Button text={"Add"} type="submit" />
							<button onClick={handleOnClickOk} className="btn">
								Ok
							</button>
						</div>
					</form>
				</PopUp>
			) : null}

			<div className="sales-entries-container pop-up pop-down">
				<div className="title-container">
					<h1> Transaction Detail</h1>
				</div>
				<div className="sales-entry-table-container">
					<HeaderVoucher
						onChageInput={handleOnChageNewHeaderInput}
						currentHeader={currentHeader}
						totalAmount={totalAmount}
					/>
					{/* details section starts-------->>>>>> */}
					<div className="details-container">
						<div className="detail-header">
							<h3>Detail</h3>
						</div>
						<div className="details-table-container">
							<div className="table-head">
								<table className="header-table">
									<thead>
										<tr>
											<th>Sr No</th>
											<th>Item code</th>
											<th>Item Name</th>
											<th>Qty</th>
											<th>Rate</th>
											<th>Amount</th>
										</tr>
									</thead>
								</table>
							</div>
							{currentDetail?.length ? (
								<div className="table-body-scroll">
									<table className="body-table">
										<tbody>
											{currentDetail.map((cd, index) => (
												<TableRow key={index} cd={cd} />
											))}
										</tbody>
									</table>
									<table>
										<thead>
											<tr className="total-amout-row">
												<th> Total Amount </th>
												<th>{totalAmount}</th>
											</tr>
										</thead>
									</table>
									<div className="table-add-new-record-and-cancel-container">
										{isAddingNewDetail ? (
											<>
												<Button
													onClick={
														handleOnShowNewEntryForm
													}
													text={"Add item"}
												/>
												<Button
													onClick={
														handleOnCloseTransactionDetail
													}
													text={
														"Cancel this tranaction"
													}
												/>
												<Button
													onClick={handleSaveToDB}
													className={"save-record"}
													text={
														"Save this transaction"
													}
												/>
											</>
										) : (
											<>
												<Button
													onClick={
														handleOnCloseTransactionDetail
													}
													text={"Ok"}
												/>
												<Button
													className={"print"}
													onClick={handleOnPrinting}
													text={"Print"}
												/>
											</>
										)}
									</div>
								</div>
							) : (
								<div className="no-record-message">
									<h3>No Records Found</h3>
									{isAddingNewDetail ? (
										<Button
											onClick={handleOnShowNewEntryForm}
											text={"Add new record"}
										/>
									) : null}
									<Button
										onClick={handleOnCloseTransactionDetail}
										text={"Ok"}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default TransactionDetail;
