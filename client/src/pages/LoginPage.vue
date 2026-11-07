<script setup>
	import { ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { Notyf } from 'notyf';
	import api from '../api';
	import { useGlobalStore } from '../stores/global';

	const router = useRouter();
	const notyf = new Notyf();
	const { getUserDetails } = useGlobalStore();

	const email = ref("");
	const password = ref("");
	const isSubmitting = ref(false);

	async function handleSubmit(e) {

		e.preventDefault();

		if(email.value.trim() === "" || password.value === "") {
			notyf.error("Please enter your email and password");
			return;
		}

		isSubmitting.value = true;

		try {
			let { data } = await api.post('/users/login', {
				email: email.value,
				password: password.value
			});

			// save the token so the user stays logged in
			localStorage.setItem('token', data.access);

			await getUserDetails(data.access);

			notyf.success("Login successful");
			router.push('/posts');

		} catch(e) {
			console.log(e);
			notyf.error(e.response && e.response.data && e.response.data.message ? e.response.data.message : "Login failed");
		} finally {
			isSubmitting.value = false;
		}
	}
</script>

<template>
	<div class="auth-wrapper d-flex justify-content-center align-items-center min-vh-100">
		

		<div class="auth-form">
			<h1>Login</h1>
			<form v-on:submit="handleSubmit">
				<div class="mb-3">
					<label for="email" class="form-label">Email</label>
					<input type="email" class="form-control" id="email" v-model="email" />
				</div>
				<div class="mb-3">
					<label for="password" class="form-label">Password</label>
					<input type="password" class="form-control" id="password" v-model="password" />
				</div>
				<button type="submit" class="btn btn-primary w-100" :disabled="isSubmitting">{{ isSubmitting ? 'Please wait...' : 'Login' }}</button>
			</form>
			<p class="mt-3 text-center">No account yet? <router-link to="/register">Register</router-link></p>
		</div>
	</div>
</template>
