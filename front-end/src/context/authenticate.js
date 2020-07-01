import React from 'react';

const authenticate=React.createContext({
	isAuthenticated:false,
	user:'User'
})

export default authenticate;