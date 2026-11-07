<script setup>
	import { useGlobalStore } from '../stores/global';

	const { user } = useGlobalStore();
</script>

<template>
	<nav class="sidebar">
		<router-link to="/posts" class="logo">Inkling<span class="logo-dot"></span></router-link>

		<div class="sidebar-links">
			<router-link to="/posts"><i class="bi bi-journal-text"></i> All posts</router-link>

			<!-- only for logged in users -->
			<router-link to="/write" v-if="user.token"><i class="bi bi-pencil-square"></i> Write a post</router-link>
			<router-link to="/my-posts" v-if="user.token"><i class="bi bi-collection"></i> My posts</router-link>
			<router-link to="/logout" v-if="user.token"><i class="bi bi-box-arrow-right"></i> Logout</router-link>

			<!-- only for guests -->
			<router-link to="/login" v-if="!user.token"><i class="bi bi-box-arrow-in-right"></i> Login</router-link>
			<router-link to="/register" v-if="!user.token"><i class="bi bi-person-plus"></i> Register</router-link>
		</div>

		<p class="sidebar-user" v-if="user.token && user.username">
			{{ user.username }}
			<span v-if="user.isAdmin" class="admin-tag">Admin</span>
		</p>
	</nav>
</template>
