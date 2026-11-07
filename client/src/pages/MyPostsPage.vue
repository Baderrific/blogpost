<script setup>
	import { ref, onBeforeMount } from 'vue';
	import { Notyf } from 'notyf';
	import api from '../api';
	import PostComponent from '../components/PostComponent.vue';

	const notyf = new Notyf();

	const posts = ref([]);
	const loading = ref(true);

	// get only the posts of the logged in user
	async function getMyPosts() {
		try {
			let { data } = await api.get('/posts/my-posts');
			posts.value = data.result;
		} catch(e) {
			console.log(e);
			notyf.error("Cannot load your posts");
		} finally {
			loading.value = false;
		}
	}

	async function deletePost(id) {

		if(!confirm("Are you sure you want to delete this post?")) {
			return;
		}

		try {
			await api.delete('/posts/' + id);

			// remove the deleted post from the list
			posts.value = posts.value.filter(post => post._id !== id);

			notyf.success("Post deleted");
		} catch(e) {
			console.log(e);
			notyf.error("Cannot delete the post");
		}
	}

	onBeforeMount(getMyPosts);
</script>

<template>
	<div class="page">
		<h1>My posts</h1>
		<router-link to="/write" class="btn btn-teal mb-4"><i class="bi bi-pencil-square"></i> Write a post</router-link>

		<p v-if="loading">Loading...</p>

		<p v-else-if="posts.length === 0">You have no posts yet.</p>

		<div class="timeline" v-else>
			<PostComponent v-for="post in posts" :key="post._id" :post="post">
				<router-link :to="'/posts/' + post._id + '/edit'" class="btn btn-outline-primary btn-sm me-2">Edit</router-link>
				<button class="btn btn-outline-danger btn-sm" v-on:click="deletePost(post._id)">Delete</button>
			</PostComponent>
		</div>
	</div>
</template>
