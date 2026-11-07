import { defineStore } from 'pinia';
import { reactive } from 'vue';
import api from '../api';

export const useGlobalStore = defineStore('global', () => {

	// this is the logged in user. it is used in the navbar and in the pages
	let user = reactive({
		token: localStorage.getItem('token'),
		id: null,
		username: null,
		isAdmin: false
	})

	// get the details of the user using the token
	async function getUserDetails(token) {

		// no token means the user is logged out
		if(!token) {
			user.token = null;
			user.id = null;
			user.username = null;
			user.isAdmin = false;
			return;
		}

		try {
			let { data } = await api.get('/users/details');

			user.token = token;
			user.id = data.user._id;
			user.username = data.user.username;
			user.isAdmin = data.user.isAdmin;

		} catch(e) {
			console.log(e);

			// token is not valid anymore so remove it
			localStorage.removeItem('token');
			user.token = null;
		}
	}

	return {
		user,
		getUserDetails
	}
})
