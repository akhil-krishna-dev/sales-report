import "./Select.css";

function Select({ labelText, options, field, ...rest }) {
	return (
		<div className="select-container">
			<label htmlFor={rest.id}>{labelText}</label>
			<select required {...rest}>
				{options?.length
					? options.map((o, index) => (
							<option
								key={index}
								value={o[field]}
								label={o[field]}
							/>
					  ))
					: null}
			</select>
		</div>
	);
}

export default Select;
