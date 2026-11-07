<script setup>
	import { ref, computed, onBeforeMount } from 'vue';
	import { useRoute, useRouter } from 'vue-router';
	import { Notyf } from 'notyf';
	import api from '../api';
	import { useGlobalStore } from '../stores/global';

	const route = useRoute();
	const router = useRouter();
	const { user } = useGlobalStore();
	const notyf = new Notyf();

	const post = ref(null);
	const loading = ref(true);

	// get one post using the id in the url
	async function getPost() {
		try {
			let { data } = await api.get('/posts/' + route.params.postId);
			post.value = data.result;
		} catch(e) {
			console.log(e);
			// post stays null so the page shows "post not found"
		} finally {
			loading.value = false;
		}
	}

	// only the author can edit
	const isAuthor = computed(() => {
		return post.value && post.value.author && post.value.author._id === user.id;
	});

	// the author can delete and the admin can delete any post
	const canDelete = computed(() => isAuthor.value || user.isAdmin);

	async function deletePost() {

		if(!confirm("Are you sure you want to delete this post?")) {
			return;
		}

		try {
			await api.delete('/posts/' + post.value._id);
			notyf.success("Post deleted");
			router.push('/posts');
		} catch(e) {
			console.log(e);
			notyf.error("Cannot delete the post");
		}
	}

	function formatDate(date) {
		return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
	}

	// split the content by blank lines so each paragraph is in its own <p>
	function getParagraphs(text) {
		return text.split(/\n\s*\n/);
	}

	onBeforeMount(getPost);
</script>

<template>
	<div class="page page-small">
		<router-link to="/posts" class="back-link"><i class="bi bi-arrow-left"></i> Back to all posts</router-link>

		<p v-if="loading">Loading...</p>

		<p v-else-if="!post">Post not found.</p>

		<div v-else>
			<h1 class="post-title">{{ post.title }}</h1>
			<p class="post-info">
				<i class="bi bi-person"></i> {{ post.author ? post.author.username : 'Deleted user' }}
				&nbsp;&nbsp;
				<i class="bi bi-calendar3"></i> {{ formatDate(post.createdAt) }}
			</p>

			<div class="mb-4" v-if="isAuthor || canDelete">
				<router-link :to="'/posts/' + post._id + '/edit'" class="btn btn-outline-primary btn-sm me-2" v-if="isAuthor">Edit</router-link>
				<button class="btn btn-outline-danger btn-sm" v-if="canDelete" v-on:click="deletePost">Delete</button>
			</div>

			<div class="post-content">
				<p v-for="(paragraph, index) in getParagraphs(post.content)" :key="index">{{ paragraph }}</p>
			</div>
		</div>
	</div>
</template>
