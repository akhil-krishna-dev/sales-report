import { createSlice } from "@reduxjs/toolkit";

const appControlSlices = createSlice({
	name: "appControl",
	initialState: {
		home: {
			showTransactionDetail: false,
			showNewEntryForm: false,
		},
	},
	reducers: {
		updateShowTransactionDetail: (state, action) => {
			state.home.showTransactionDetail = action.payload;
		},
		updateShowNewEntryForm: (state, action) => {
			state.home.showNewEntryForm = action.payload;
		},
	},
});

export const { updateShowTransactionDetail, updateShowNewEntryForm } =
	appControlSlices.actions;
export default appControlSlices.reducer;
