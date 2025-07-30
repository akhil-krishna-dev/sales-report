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

	const [detailItemIndexForDeleting, setDetailItemIndexForDeleting] =
		useState([]);

	const [showWarningMesage, setShowWarningMessage] = useState("");

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
		if (currentDetail && !currentDetail.length) {
			setIsUnSavedItems(false);
		}
	}, [currentDetail]);

	const closeTransactionDetail = () => {
		dispatch(updateCurrentHeader(null));
		dispatch(updateShowTransactionDetail(false));
		dispatch(updateIsAddingNewDetail(false));
	};
	const handleOnCloseTransactionDetail = () => {
		if (isUnsavedItems) {
			setShowWarningMessage(
				"You have some unsaved entries related to this transaction!"
			);
			return;
		}
		closeTransactionDetail();
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
		setTotalAmount((prev) => prev + qty * rate);
		dispatch(updateUnSavedDetail(data));
		setCurrentDetail((prev) => {
			if (prev) {
				return [...prev, data];
			}
			return [data];
		});
		setIsUnSavedItems(true);
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

	const handleOnDeletingNewDetailItems = () => {
		setCurrentDetail((prev) => {
			let newTotal = 0;
			if (prev) {
				const newDetail = prev.filter((item, index) => {
					if (!detailItemIndexForDeleting.includes(index)) {
						console.log(item);
						newTotal += item.qty * item.rate;
						return true;
					}
					return false;
				});
				setDetailItemIndexForDeleting([]);
				if (newTotal) {
					setTotalAmount(newTotal);
				}
				return newDetail;
			}
			return prev;
		});
	};

	const handleOnCancelingNewDetailItemsDeleting = () => {
		setDetailItemIndexForDeleting([]);
	};

	const handleOnSelectNewDetailItemIndex = (index) => {
		setDetailItemIndexForDeleting((prev) => [...prev, index]);
	};
	const handleDeselectNewDetailItemIndex = (index) => {
		setDetailItemIndexForDeleting((prev) =>
			prev.filter((currentIndex) => currentIndex !== index)
		);
	};

	const handleOnPrinting = () => {
		window.print();
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

			{showWarningMesage ? (
				<PopUp zIndex={1002}>
					<div className="waring-message-container scale">
						<h3>{showWarningMesage}</h3>
						<div className="action-buttons">
							<Button
								onClick={() => setShowWarningMessage("")}
								text={"Check Detail"}
							/>
							<Button
								onClick={closeTransactionDetail}
								text={"Don't Save"}
							/>
						</div>
					</div>
				</PopUp>
			) : null}

			<div className="sales-entries-container scale">
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
												<TableRow
													onSelectItemIndex={
														handleOnSelectNewDetailItemIndex
													}
													onDeselectItemIndex={
														handleDeselectNewDetailItemIndex
													}
													detailItemIndexForDeleting={
														detailItemIndexForDeleting
													}
													index={index}
													key={index}
													cd={cd}
												/>
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
												{!detailItemIndexForDeleting.length ? (
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
															onClick={
																handleSaveToDB
															}
															className={
																"save-record"
															}
															text={
																"Save this transaction"
															}
														/>
													</>
												) : (
													<>
														<Button
															onClick={
																handleOnCancelingNewDetailItemsDeleting
															}
															text={
																"Cancel Deleting"
															}
														/>
														<Button
															onClick={
																handleOnDeletingNewDetailItems
															}
															className={
																"save-record"
															}
															text={
																"Delete selected items"
															}
														/>
													</>
												)}
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
