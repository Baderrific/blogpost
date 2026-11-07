import axios from 'axios';

// this is the axios setup. all requests use the server url from the .env file
const api = axios.create({
	baseURL: import.meta.env.VITE_BLOG_API
});

// before every request, check if there is a token and add it to the headers
api.interceptors.request.use((config) => {

	const token = localStorage.getItem('token');

	if(token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
})

export default api;
