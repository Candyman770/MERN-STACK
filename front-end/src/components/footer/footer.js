import React from 'react';
import classes from './footer.module.css';

const footer=props=>{
	return (
		<div className={classes.Footer}>
			<h3>Contact Us</h3>
			<p>Phone No: 9810911599, 9810991991</p>
			<p>Telephone No: 0120-1234987</p>
			<nav className={classes.Social}>
				<a href="#"><i className="fa fa-twitter-square" aria-hidden="true"></i></a>
				<a href="#"><i className="fa fa-facebook-square" aria-hidden="true"></i></a>
				<a href="#"><i className="fa fa-linkedin-square" aria-hidden="true"></i></a>
				<a href="#"><i className="fa fa-github" aria-hidden="true"></i></a>
				<a href="#"><i className="fa fa-instagram" aria-hidden="true"></i></a>
			</nav>
		</div>
	);
}

export default footer;