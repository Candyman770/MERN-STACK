import React from 'react';
import classes from './dish.module.css';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import Img from '../../assets/i1.jpg';

const Dish=props=>{
	const dishHandler=(id)=>{
		props.history.push(`/dishes/comments/${id}`)
	}
	return (
		<div className={classes.Dish}>
			<img src={Img} alt='alt-image.jpg'/>
			<p className={classes.Name}>{props.name}</p>
			<p>{props.description}<br />
			<span style={{
				fontWeight:'bold',
				textTransform:'capitalize',
				color:'#339933'
			}}>{props.category}</span><br />
			<span style={{
				fontWeight:'bold'
			}}>Price : {props.price}</span><br />
			<span style={{
				fontWeight:'bold',
				color:'red'
			}}>{props.label}</span>
			</p>
			{props.children}
			<button 
				className={classes.Comments}
				onClick={()=>dishHandler(props.id)}>Comments</button>
		</div>
	);
}


export default Dish;