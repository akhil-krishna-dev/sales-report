import { configureStore } from "@reduxjs/toolkit";
import transactionsSlices from "./slices/transactionsSlices";
import appControlSlices from "./slices/appControlSlices";

const store = configureStore({
	reducer: {
		transactions: transactionsSlices,
		appControl: appControlSlices,
	},
});

export default store;
