<script setup>
	import { ref, onBeforeMount } from 'vue';
	import { useRoute, useRouter } from 'vue-router';
	import { Notyf } from 'notyf';
	import api from '../api';
	import { useGlobalStore } from '../stores/global';

	const route = useRoute();
	const router = useRouter();
	const { user } = useGlobalStore();
	const notyf = new Notyf();

	const title = ref("");
	const content = ref("");
	const loading = ref(true);
	const isSubmitting = ref(false);

	// get the current post so the form is already filled
	async function getPost() {
		try {
			let { data } = await api.get('/posts/' + route.params.postId);

			// only the author can edit (the server also checks this)
			if(user.id && data.result.author._id !== user.id) {
				notyf.error("You can only edit your own posts");
				router.push('/posts/' + route.params.postId);
				return;
			}

			title.value = data.result.title;
			content.value = data.result.content;

		} catch(e) {
			console.log(e);
			notyf.error("Post not found");
			router.push('/posts');
		} finally {
			loading.value = false;
		}
	}

	async function handleSubmit(e) {

		e.preventDefault();

		if(title.value.trim() === "" || content.value.trim() === "") {
			notyf.error("Please enter a title and content");
			return;
		}

		isSubmitting.value = true;

		try {
			await api.put('/posts/' + route.params.postId, {
				title: title.value,
				content: content.value
			});

			notyf.success("Post updated");
			router.push('/posts/' + route.params.postId);

		} catch(e) {
			console.log(e);
			notyf.error(e.response && e.response.data && e.response.data.message ? e.response.data.message : "Cannot update the post");
		} finally {
			isSubmitting.value = false;
		}
	}

	onBeforeMount(getPost);
</script>

<template>
	<div class="page page-small">
		<h1>Edit post</h1>

		<p v-if="loading">Loading...</p>

		<form v-on:submit="handleSubmit" v-else>
			<div class="mb-3">
				<label for="title" class="form-label">Title</label>
				<input type="text" class="form-control" id="title" v-model="title" maxlength="150" />
			</div>
			<div class="mb-3">
				<label for="content" class="form-label">Content</label>
				<textarea class="form-control" id="content" rows="12" v-model="content"></textarea>
			</div>
			<button type="submit" class="btn btn-teal me-2" :disabled="isSubmitting">{{ isSubmitting ? 'Saving...' : 'Save changes' }}</button>
			<router-link :to="'/posts/' + route.params.postId" class="btn btn-outline-primary">Cancel</router-link>
		</form>
	</div>
</template>
