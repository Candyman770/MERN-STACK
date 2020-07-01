import React,{useEffect,useState} from 'react';
import classes from './Dishes.module.css';
import Dish from '../../components/dish/dish';
import * as actions from '../../store/actions/index';
import Pagination from '../../components/pagination/pagination';
import Input from '../../components/UI/input/input';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

const Dishes=props=>{

	/*const query=new URLSearchParams(props.location.search);
	if(Array(...query.entries())[0]!=undefined){
    	const currentPage=+Array(...query.entries())[0][1];
	}*/
	useEffect(()=>{
		props.onFetchDishes(props.location.search);
		if(props.isAuthenticated){
			props.onFetchFavorites();
		}
		const filterQuery=new URLSearchParams(props.location.search);
		for(let param of filterQuery.entries()){
			if(param[0]==='page')
				continue;
			else{
				filter[param[0]].value=param[1];
			}
		}
	},[])
	const [filter,setFilter]=useState({
		category:{
			elementType:'select',
			elementConfig:{
				options:[
					{value:'All',displayValue:'All'},
					{value:'appetizer',displayValue:'Appetizer'},
					{value:'mains',displayValue:'Mains'},
					{value:'dessert',displayValue:'Dessert'}
				]
			},
			value:'All'
		},
		label:{
			elementType:'select',
			elementConfig:{
				options:[
					{value:'None',displayValue:'None'},
					{value:'New',displayValue:'New'},
					{value:'Hot',displayValue:'Hot'}
				]
			},
			value:'None'
		},
		price:{
			elementType:'input',
			elementConfig:{
				type:'text',
				placeholder:'Price Limit'
			},
			value:''
		}
	})
	const inputChangeHandler=(event,id)=>{
		const updatedControls={
			...filter,
			[id]:{
				...filter[id],
				value:event.target.value
			}
		}
		setFilter(updatedControls);
	}
	const submitHandler=(event)=>{
		event.preventDefault();
		//console.log(filter.label.value);
		const queryInit=new URLSearchParams(props.location.search);
		const query=[];
		for(let param of queryInit.entries()){
			if(param[0]==='page'){
				query.push(param.join('='));
				break;
			}
		}
		for(let key in filter){
			console.log(key.value)
			query.push(encodeURIComponent(key)+'='+filter[key].value);
		}
		//console.log(filter.label.value);
		const queryString=query.join('&');
		props.history.push({
			search:'?'+queryString
		});
		window.location.reload();
	}
	const filterElementArray=[];
	for(let key in filter){
		filterElementArray.push({
			id:key,
			config:filter[key]
		})
	}
	let filterForm=(
		<form onSubmit={submitHandler}>
			{filterElementArray.map(fil=>(
				<Input
					key={fil.id}
					elementType={fil.config.elementType}
					elementConfig={fil.config.elementConfig}
					value={fil.config.value} 
					label={fil.id}
					changed={(event)=>inputChangeHandler(event,fil.id)}/>
			))}
			<button>Submit</button>
		</form>
	)

	let dishes=props.error?<p>Dishes cant be loaded</p>:<p>Loading...</p>
	if(props.dishes.length){
		dishes=(
			props.dishes.map(dish=>{
				const index=props.favorites.findIndex(fav=>fav._id===dish._id);
				return <Dish 
					key={dish._id} 
					id={dish._id}
					price={dish.price}
					description={dish.description}
					category={dish.category}
					label={dish.label}
					featured={dish.featured}
					name={dish.name} 
					history={props.history}>
					{
						!props.isAuthenticated?null:index!=0?
						<button className={classes.Remove}
								onClick={()=>props.onDeleteOne(dish._id)}>
						<i className="fa fa-heart" aria-hidden="true"></i></button>:
						<button className={classes.Favorite}
								onClick={()=>props.onAddFavorite(dish._id)}>
						<i className="fa fa-heart" aria-hidden="true"></i></button>
					}
					
					</Dish>
			})

		)
	}
	return (
		<div>
			
			<h2>Lets Dig In!</h2>
			{filterForm}
			<div className={classes.Dishes}>
			
				{dishes}
			</div>
			<Pagination 
				currentPage={props.currentPage}
				hasPrevPage={props.currentPage>1}
				hasNextPage={props.hasNextPage}
				lastPage={props.lastPage} 
				queryString={props.location.search}/>
		</div>
	)
};

const mapStateToProps=state=>{
	return {
		dishes:state.dishes.dishes,
		error:state.dishes.err,
		isAuthenticated:state.auth.token!==null,
		favorites:state.favorites.favorites,
		hasNextPage:state.dishes.hasNextPage,
		lastPage:state.dishes.lastPage,
		currentPage:state.dishes.currentPage
	}
}

const mapDispatchToProps=dispatch=>{
	return{
		onFetchDishes:(query)=>dispatch(actions.fetch(query)),
		onAddFavorite:(id)=>dispatch(actions.addFavorite(id)),
		onDeleteOne:(id)=>dispatch(actions.deleteFavorite(id)),
		onFetchFavorites:()=>dispatch(actions.fetchFavorites())
	}
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Dishes));