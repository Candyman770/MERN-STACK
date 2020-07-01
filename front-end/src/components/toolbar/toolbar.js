import React from 'react';
import NavItems from '../navItems/navItems';
import classes from './toolbar.module.css';
import ReactSymbol from '../../assets/react-symbol.jpg';

const toolbar=props=>{
	return(
		<header className={classes.Toolbar}>
			<div>
				<img src={ReactSymbol} alt="slide-img"/>
				<h2>React-Project</h2>
			</div>
			<nav>
				<NavItems />
			</nav>
		</header>
	);
}

export default toolbar;