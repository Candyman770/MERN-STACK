import React from 'react';

const Filter=props=>{
	return(
		<select >
			<option>
				<select>
					<option>Appetizer</option>
					<option>Desert</option>
					<option>Mains</option>
				</select>
			</option>
			<option>
				<select>
					<option>New</option>
					<option>Hot</option>
				</select>
			</option>
		</select>
	);
};

export default Filter;