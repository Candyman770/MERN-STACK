import axios from 'axios';

const instance=axios.create({
	baseURL:'https://localhost:3443/'
});

export default instance;