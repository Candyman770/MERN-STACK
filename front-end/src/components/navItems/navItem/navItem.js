import React from 'react';
import classes from './navItem.module.css';
import {NavLink} from 'react-router-dom';

const navItem=props=>{
	return (
		<li className={classes.NavItem}>
			<NavLink 
				exact={props.exact} 
				to={props.path}
				activeClassName={classes.active}
				onClick={props.clicked}>{props.children}
				</NavLink>
		</li>
	);
}

export default navItem;