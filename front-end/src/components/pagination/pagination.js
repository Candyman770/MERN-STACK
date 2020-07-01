import React from 'react';
//import {a} from 'react-router-dom';
import classes from './pagination.module.css';

const Pagination=props=>{
	const {
		currentPage,
		hasNextPage,
		hasPrevPage,
		lastPage,
		queryString
	}=props;
	const filterQuery=new URLSearchParams(queryString);
	const query=[];
	for(let param of filterQuery.entries()){
		if(param[0]!=='page'){
			query.push(`${param[0]}=${param[1]}`)
		}
	}
	let filterString=query.join('&');
	if(filterString)
		filterString='&'+filterString;
	return(
		<nav className={classes.Pagination}>
			{currentPage!=1&&currentPage-1!=1?<a href={`?page=1${filterString}`}>1</a>:null}
			{currentPage>3?<span>...</span>:null}
			{hasPrevPage?<a href={`?page=${currentPage-1}${filterString}`}>{currentPage-1}</a>:null}
			<a onClick={(event)=>event.preventDefault()} className={classes.active} href={`?page=${currentPage}${filterString}`}>{currentPage}</a>
			{hasNextPage?<a href={`?page=${currentPage+1}${filterString}`}>{currentPage+1}</a>:null}
			{currentPage!==lastPage&&currentPage+1!==lastPage&&currentPage+2!==lastPage?
				<span>...</span>:null}
			{currentPage!==lastPage&&currentPage+1!==lastPage?
				<a href={`?page=${lastPage}${filterString}`} >{`${lastPage}`}</a>:null}
		</nav>
	)
};

export default Pagination;