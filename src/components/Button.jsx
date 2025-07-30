import "./Button.css";
function Button({ text, onClick, type = "button", className }) {
	return (
		<button
			onClick={onClick}
			className={`custom-button ${className}`}
			type={type}
		>
			{text}
		</button>
	);
}

export default Button;
