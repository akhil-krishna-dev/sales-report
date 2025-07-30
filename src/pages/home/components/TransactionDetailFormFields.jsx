import "./TransactionDetailFormFields.css";
import Input from "../../../components/form/Input";
import TextArea from "../../../components/form/TextArea";
import { useSelector } from "react-redux";
import Select from "../../../components/form/Select";

function TransactionDetailFormFields({ width }) {
	const item = useSelector((state) => state.transactions.item);

	return (
		<div
			style={{ width }}
			className="transaction-detail-form-fields-container"
		>
			<div className="title">
				<h2>New Record</h2>
			</div>
			<Select
				type="text"
				placeholder="Item code"
				name="item_code"
				id="item_code"
				labelText="Item code"
				options={item}
				field={"item_code"}
			/>
			<Select
				options={item}
				field={"item_name"}
				type="text"
				placeholder="Item name"
				name="item_name"
				id="item_name"
				labelText="Item name"
			/>
			<TextArea
				type="text"
				placeholder="Description"
				name="description"
				id="description"
				labelText="Description"
			/>
			<div className="quantity-and-rate-container">
				<Input
					type="number"
					placeholder="Quantity"
					name="qty"
					id="qty"
					labelText="Quantity"
				/>
				<Input
					type="number"
					placeholder="Rate"
					name="rate"
					id="rate"
					labelText="Rate"
				/>
			</div>
		</div>
	);
}

export default TransactionDetailFormFields;
