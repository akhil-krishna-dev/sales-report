import { useEffect } from "react";
import "./App.css";
import Container from "./components/Container";
import Home from "./pages/home/Home";
import { useDispatch, useSelector } from "react-redux";
import {
	updateHeader,
	updateItem,
	updateSavedDetail,
} from "./store/slices/transactionsSlices";
import PopUp from "./components/PopUp";
import TransactionDetail from "./pages/home/components/TransactionDetail";

export const url = import.meta.env.VITE_BASE_URL;

function App() {
	const dispatch = useDispatch();
	const showTransactionDetail = useSelector(
		(state) => state.appControl.home.showTransactionDetail
	);

	useEffect(() => {
		fetch(`${url}header`)
			.then((res) => res.json())
			.then((res) => {
				dispatch(updateHeader(res));
			});
		fetch(`${url}detail`)
			.then((res) => res.json())
			.then((res) => {
				dispatch(updateSavedDetail(res));
			});
		fetch(`${url}item`)
			.then((res) => res.json())
			.then((res) => {
				dispatch(updateItem(res));
			});
	}, []);

	return (
		<>
			{showTransactionDetail ? (
				<PopUp zIndex={2}>
					<TransactionDetail />
				</PopUp>
			) : null}

			<Container>
				<Home />
			</Container>
		</>
	);
}

export default App;
