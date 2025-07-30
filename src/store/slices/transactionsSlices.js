import { createSlice } from "@reduxjs/toolkit";

const transactionsSlices = createSlice({
	name: "transations",
	initialState: {
		header: {
			allHeader: [],
			currentHeader: null,
			newHeader: {
				voucherNo: 0,
				voucherDate: "",
				totalAmount: 0,
			},
		},
		detail: { saved: [], unSaved: [], isAddingNew: false },
		item: [],
		isDeletingTransaction: false,
	},
	reducers: {
		updateHeader: (state, action) => {
			state.header.allHeader = action.payload;
		},
		updateHeaderWithNewHeader: (state, action) => {
			state.header.allHeader.push(action.payload);
		},
		updateCurrentHeader: (state, action) => {
			state.header.currentHeader = action.payload;
		},
		updateSavedDetail: (state, action) => {
			state.detail.saved = action.payload;
		},
		updateSavedDetailWithNewDetail: (state, action) => {
			state.detail.saved.push(...action.payload);
		},
		updateItem: (state, action) => {
			state.item = action.payload;
		},
		updateUnSavedDetail: (state, action) => {
			if (action.payload === false) {
				state.detail.unSaved = [];
			} else {
				state.detail.unSaved.push(action.payload);
			}
		},
		updateIsAddingNewDetail: (state, action) => {
			state.detail.isAddingNew = action.payload;
		},
		updateNewVoucherNumber: (state, action) => {
			state.header.newHeader.voucherNo = action.payload;
		},
		updateNewVoucherDate: (state, action) => {
			state.header.newHeader.voucherDate = action.payload;
		},
		updateIsDeletingTransaction: (state, action) => {
			state.isDeletingTransaction = action.payload;
		},
	},
});

export const {
	updateItem,
	updateHeader,
	updateHeaderWithNewHeader,
	updateSavedDetail,
	updateUnSavedDetail,
	updateSavedDetailWithNewDetail,
	updateCurrentHeader,
	updateIsAddingNewDetail,
	updateNewVoucherNumber,
	updateIsDeletingTransaction,
	updateNewVoucherDate,
} = transactionsSlices.actions;
export default transactionsSlices.reducer;
