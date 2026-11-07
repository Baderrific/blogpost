<script setup>
	import { onBeforeMount, computed } from 'vue';
	import { useRoute } from 'vue-router';
	import NavbarComponent from './components/NavbarComponent.vue';
	import { useGlobalStore } from './stores/global';

	const { getUserDetails } = useGlobalStore();
	const route = useRoute();

	// when the page loads or refreshes, get the user details if there is a token
	onBeforeMount(() => {
		getUserDetails(localStorage.getItem('token'));
	})

	// login and register pages do not show the navbar
	const showNavbar = computed(() => route.name !== 'Login' && route.name !== 'Register');
</script>

<template>
	<NavbarComponent v-if="showNavbar" />
	<main :class="{ 'with-nav': showNavbar }">
		<router-view />
	</main>
</template>
