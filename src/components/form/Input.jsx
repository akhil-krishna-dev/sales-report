import "./Input.css";
function Input({ labelText, ...rest }) {
	return (
		<div className="input-container">
			<label htmlFor={rest.id}>{labelText}</label>
			<input required {...rest} />
		</div>
	);
}

export default Input;
