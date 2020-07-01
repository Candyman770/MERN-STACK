import React,{useEffect,useState} from 'react';
import {connect} from 'react-redux';
import classes from './DishComments.module.css';
import DishComment from '../../components/dishComment/dishComment';
import Input from '../../components/UI/input/input';
import * as actions from '../../store/actions/index';
import Img from '../../assets/i1.jpg';

const DishComments=props=>{
	const arr=window.location.pathname.split('/');
	useEffect(()=>{
		console.log(arr[3]);
		props.onFetchComments(arr[3]);
	},[]);
	const [postComment,setPostComment]=useState({
		comment:{
			elementType:'textarea',
			elementConfig:{
				placeholder:'Your Comment',
				type:'text'
			},
			value:''
		},
		rating:{
			elementType:'select',
			elementConfig:{
				options:[
					{value:1,displayValue:1},
					{value:2,displayValue:2},
					{value:3,displayValue:3},
					{value:4,displayValue:4},
					{value:5,displayValue:5},
				]
			},
			value:5
		}
	})
	const inputChangeHandler=(event,id)=>{
		const updatedControls={
			...postComment,
			[id]:{
				...postComment[id],
				value:event.target.value
			}
		}
		setPostComment(updatedControls);
	}
	const submitHandler=(event)=>{
		event.preventDefault();
		const data={};
		for(let key in postComment){
			data[key]=postComment[key].value;
		}
		props.onPostComment(arr[2],data);
	}
	const postCommentArray=[];
	for(let key in postComment){
		postCommentArray.push({
			id:key,
			config:postComment[key]
		})
	};
	let postForm=(
		<form onSubmit={submitHandler}>
			{postCommentArray.map(element=>{
				return <Input 
					key={element.id}
					elementType={element.config.elementType}
					elementConfig={element.config.elementConfig}
					value={element.config.value}
					label={element.id}
					changed={(event)=>inputChangeHandler(event,element.id)} />
			})}
			<button className={classes.Button}>Submit</button>
		</form>
	);
	let dishComments=props.loading?<p>Loading...</p>:props.err?<p>Dishes cant be loaded</p>:null
	//console.log(props.commentsInfo);
	if( props.commentsInfo.hasOwnProperty('dish')){
		dishComments=(
			<React.Fragment>
				<h2>{props.commentsInfo.dish.name}</h2>
					<div className={classes.Content}>
						<img src={Img} alt='alt-image.jpg' />
						<span><p>{props.commentsInfo.dish.description}</p>
						<p style={{
							textTransform:'capitalize',
							fontWeight:'bold',
							color:'#339933'
						}}>{props.commentsInfo.dish.category}</p>
						<p style={{
							fontWeight:'bold'
						}}>Price : {props.commentsInfo.dish.price}</p>					
						<p>{props.commentsInfo.dish.label}</p></span>
					</div>
				{props.isAuthenticated?postForm:null}
				<div className={classes.Comments}>
				<h3>Comments {props.commentsInfo.comments.length}</h3>
				{props.commentsInfo.comments.map(comment=>{
				return <DishComment 
					key={comment._id}
					id={comment._id}
					author={comment.author.username}
					comment={comment.comment}
					rating={comment.rating} >
					{props.userId===comment.author._id?
						<React.Fragment>
						<button>Edit</button>
						<button onClick={()=>props.onDeleteComment(arr[2],comment._id)}>Delete</button>
						</React.Fragment>
						:null}
				</DishComment>
				})}
				</div>
			
			</React.Fragment>
		);
		
	}
	return (
		<div className={classes.DishComments}>
			{dishComments}
		</div>
	);
};

const mapStateToProps=state=>{
	return {
		commentsInfo:state.comments.commentsInfo,
		err:state.comments.err,
		loading:state.comments.loading,
		isAuthenticated:state.auth.token!==null,
		userId:state.auth.userId
	}
}

const mapDispatchToProps=dispatch=>{
	return {
		onFetchComments:(id)=>dispatch(actions.fetchComments(id)),
		onPostComment:(id,data)=>dispatch(actions.postComment(id,data)),
		onDeleteComment:(dishId,commentId)=>dispatch(actions.deletingComment(dishId,commentId)),
		onUpdateComment:(dishId,commentId,data)=>dispatch(actions.updatingComment(dishId,commentId,data))
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(DishComments);