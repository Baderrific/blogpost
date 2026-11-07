<script setup>
	import { ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { Notyf } from 'notyf';
	import api from '../api';

	const router = useRouter();
	const notyf = new Notyf();

	const username = ref("");
	const email = ref("");
	const password = ref("");
	const confirmPassword = ref("");
	const isSubmitting = ref(false);

	async function handleSubmit(e) {

		e.preventDefault();

		// check the inputs before sending to the server
		if(username.value.trim() === "" || email.value.trim() === "" || password.value === "") {
			notyf.error("Please fill in all the fields");
			return;
		}

		if(password.value.length < 8) {
			notyf.error("Password must be at least 8 characters");
			return;
		}

		if(password.value !== confirmPassword.value) {
			notyf.error("Passwords do not match");
			return;
		}

		isSubmitting.value = true;

		try {
			await api.post('/users/register', {
				username: username.value,
				email: email.value,
				password: password.value
			});

			notyf.success("Registered successfully. You can login now");
			router.push('/login');

		} catch(e) {
			console.log(e);
			// the server sends the reason, for example if the email is already used
			notyf.error(e.response && e.response.data && e.response.data.message ? e.response.data.message : "Registration failed");
		} finally {
			isSubmitting.value = false;
		}
	}
</script>

<template>
	<div class="auth-wrapper d-flex justify-content-center align-items-center min-vh-100">


		<div class="auth-form">
			<h1>Register</h1>
			<form v-on:submit="handleSubmit">
				<div class="mb-3">
					<label for="username" class="form-label">Username</label>
					<input type="text" class="form-control" id="username" v-model="username" />
				</div>
				<div class="mb-3">
					<label for="email" class="form-label">Email</label>
					<input type="email" class="form-control" id="email" v-model="email" />
				</div>
				<div class="mb-3">
					<label for="password" class="form-label">Password</label>
					<input type="password" class="form-control" id="password" v-model="password" />
				</div>
				<div class="mb-3">
					<label for="confirmPassword" class="form-label">Confirm password</label>
					<input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" />
				</div>
				<button type="submit" class="btn btn-primary w-100" :disabled="isSubmitting">{{ isSubmitting ? 'Please wait...' : 'Register' }}</button>
			</form>
			<p class="mt-3 text-center">Already have an account? <router-link to="/login">Login</router-link></p>
		</div>
	</div>
</template>
