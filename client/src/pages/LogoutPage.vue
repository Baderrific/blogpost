<script setup>
	import { onBeforeMount } from 'vue';
	import { useRouter } from 'vue-router';
	import { Notyf } from 'notyf';
	import { useGlobalStore } from '../stores/global';

	const router = useRouter();
	const notyf = new Notyf();
	const { getUserDetails } = useGlobalStore();

	onBeforeMount(() => {
		// remove the token and clear the user
		localStorage.removeItem('token');
		getUserDetails(null);

		notyf.success("Logged out");
		router.push('/posts');
	})
</script>

<template>
</template>
