import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function TableRow({
	onSelectItemIndex,
	onDeselectItemIndex,
	detailItemIndexForDeleting,
	index,
	cd,
}) {
	const [isSelected, setIsSelected] = useState(false);
	const isAddingNew = useSelector(
		(state) => state.transactions.detail.isAddingNew
	);
	const handleOnSelectItem = () => {
		if (!isAddingNew) return;
		setIsSelected((prev) => !prev);
	};

	useEffect(() => {
		if (!detailItemIndexForDeleting.length) {
			setIsSelected(false);
		}
	}, [detailItemIndexForDeleting]);

	useEffect(() => {
		if (isSelected) {
			onSelectItemIndex(index);
		} else {
			onDeselectItemIndex(index);
		}
	}, [isSelected]);
	return (
		<tr
			className={`table-row ${isSelected ? "is-selected" : ""} `}
			onClick={handleOnSelectItem}
		>
			<td>{cd.sr_no}</td>
			<td>{cd.item_code}</td>
			<td>{cd.item_name}</td>
			<td>{cd.qty}</td>
			<td>{cd.rate}</td>
			<td>{cd.qty * cd.rate}</td>
		</tr>
	);
}

export default TableRow;
