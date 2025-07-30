import "./TextArea.css";
function TextArea({ labelText, ...rest }) {
	return (
		<div className="textarea-container">
			<label htmlFor={rest.id}>{labelText}</label>
			<textarea required {...rest}></textarea>
		</div>
	);
}

export default TextArea;
