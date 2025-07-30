import "./PopUp.css";
function PopUp({ children, zIndex = 0 }) {
	return (
		<div style={{ zIndex }} className="pop-up-container">
			{children}
		</div>
	);
}

export default PopUp;
