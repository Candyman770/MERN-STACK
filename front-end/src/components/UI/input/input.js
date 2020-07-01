import React from 'react';
import classes from './input.module.css';

const Input=props=>{
	let inputElement;
	switch(props.elementType){
		case('input'):
			inputElement=<input
				className={classes.InputElement}
				{...props.elementConfig}
				value={props.value}
				onChange={props.changed} />
			break;
		case('select'):
			inputElement=(<select
				value={props.value}
				onChange={props.changed} >
				{props.elementConfig.options.map(option=>{
					 return <option value={option.value} key={option.value}>
						{option.displayValue}
					</option>
				})}
				</select>);
			break;
		case('textarea'):
			inputElement=<textarea
				value={props.value}
				onChange={props.changed}
				{...props.elementConfig} />
			break;
		default:
			inputElement=<input
				className={classes.InputElement}
				{...props.elementConfig}
				value={props.value}
				onChange={props.changed} />

	}
	return (
		<section className={classes.Input}>
			<label className={classes.Label}>{props.label}</label>
			{inputElement}
		</section>
	);
};

export default Input;