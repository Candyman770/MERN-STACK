import React from 'react';
import classes from './dishComment.module.css';

const dishComment=props=>{
	return (
		<div className={classes.DishComment}>
			<p>
			<span style={{
				fontWeight:'bold',
				color:'red'
			}}>{props.author}</span><br />
			<span>{props.comment}</span><br />
			<span style={{
				color:'goldenrod',
				fontWeight:'bold'
			}}>Rating -> {props.rating}</span></p>
			{props.children}
		</div>
	);
};

export default dishComment;