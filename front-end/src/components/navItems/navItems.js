import React,{useContext} from 'react';
import NavItem from './navItem/navItem';
import classes from './navItems.module.css';
import AuthContext from '../../context/authenticate';

const NavItems=props=>{
	const authContext=useContext(AuthContext);
	const scrollBottom=(event)=>{
		event.preventDefault();
		document.body.scrollTop=document.body.scrollHeight;
		document.documentElement.scrollTop=document.documentElement.scrollHeight;
	}
	return (
		<ul className={classes.NavItems}>
			{authContext.isAuthenticated?<li><span className={classes.User}>
				<i className="fa fa-user-circle" aria-hidden="true"></i>
				&nbsp; {`${authContext.user}`} &nbsp;
				<i className="fa fa-caret-down" aria-hidden="true"></i>
			</span></li>:null}
			<NavItem exact path="/">Home</NavItem>
			<NavItem path="/dishes">Dishes</NavItem>
			<NavItem path="/favorites">Favorites</NavItem>
			{!authContext.isAuthenticated?<NavItem path="/auth">Login</NavItem>:null}
			<NavItem clicked={scrollBottom} exact path="/">ContactUs</NavItem>
		</ul>
	);
}

export default NavItems;