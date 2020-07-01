import React from 'react';
import Toolbar from '../../components/toolbar/toolbar';
import Footer from '../../components/footer/footer';
import classes from './Layout.module.css';

const Layout=props=>{
	return (
		<div className={classes.Layout}>
			<Toolbar />
			<main>
				{props.children}
			</main>
			<Footer />
		</div>
	);
}

export default Layout;