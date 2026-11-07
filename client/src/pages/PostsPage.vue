<script setup>
	import { ref, computed, onBeforeMount } from 'vue';
	import { Notyf } from 'notyf';
	import api from '../api';
	import PostComponent from '../components/PostComponent.vue';

	const notyf = new Notyf();

	const posts = ref([]);
	const loading = ref(true);
	const search = ref("");

	// get all posts from the server
	async function getPosts() {
		try {
			let { data } = await api.get('/posts');
			posts.value = data.result;
		} catch(e) {
			console.log(e);
			notyf.error("Cannot load the posts");
		} finally {
			loading.value = false;
		}
	}

	// posts that match the search (title or author)
	const filteredPosts = computed(() => {
		const keyword = search.value.toLowerCase();

		return posts.value.filter(post => {
			const author = post.author ? post.author.username : '';
			return post.title.toLowerCase().includes(keyword) || author.toLowerCase().includes(keyword);
		});
	});

	onBeforeMount(getPosts);
</script>

<template>
	<div class="page">
		<h1>Latest writing</h1>
		<p class="text-muted">Read what other people wrote.</p>

		<input type="text" class="form-control mb-4" v-model="search" placeholder="Search by title or author" />

		<p v-if="loading">Loading posts...</p>

		<p v-else-if="posts.length === 0">There are no posts yet.</p>

		<p v-else-if="filteredPosts.length === 0">No posts found.</p>

		<div class="timeline" v-else>
			<PostComponent v-for="post in filteredPosts" :key="post._id" :post="post" />
		</div>
	</div>
</template>
