import React,{useEffect} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import classes from './Favorites.module.css';
import Dish from '../../components/dish/dish';
import {withRouter} from 'react-router-dom';

const Favorite=props=>{
	useEffect(()=>{
		props.onFetchFavorites();
	},[])
	let favorites=props.loading?<p>Loading...</p>:props.error?<p>Favorites cant be loaded</p>:null
	if(props.favorites.length){
		favorites=(
			props.favorites.map(favorite=>{
				return <Dish 
					key={favorite._id} 
					id={favorite._id}
					price={favorite.price}
					description={favorite.description}
					category={favorite.category}
					label={favorite.label}
					featured={favorite.featured}
					name={favorite.name} 
					history={props.history}>
					<button 
							className={classes.Remove}
							onClick={()=>props.onDeleteOne(favorite._id)}>Delete</button>
					</Dish>
			})
		);
	}
	return (
		<div>
			<div className={classes.Content}>
				<h2>My Favorites!</h2>
				<button className={classes.RemoveAll}onClick={props.onDeleteAll}>Remove All</button>
			</div>
			<div className={classes.Favorite}>
				{favorites}
			</div>
		</div>
	);
};

const mapStateToProps=state=>{
	return{
		favorites:state.favorites.favorites,
		error:state.favorites.err,
		loading:state.favorites.loading
	}
}

const mapDispatchToProps=dispatch=>{
	return {
		onFetchFavorites:()=>dispatch(actions.fetchFavorites()),
		onDeleteOne:(id)=>dispatch(actions.deleteFavorite(id)),
		onDeleteAll:()=>dispatch(actions.deleteFavorites())
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Favorite);