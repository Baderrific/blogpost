<script setup>
	import { ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { Notyf } from 'notyf';
	import api from '../api';

	const router = useRouter();
	const notyf = new Notyf();

	const title = ref("");
	const content = ref("");
	const isSubmitting = ref(false);

	async function handleSubmit(e) {

		e.preventDefault();

		// check the inputs first
		if(title.value.trim() === "" || content.value.trim() === "") {
			notyf.error("Please enter a title and content");
			return;
		}

		isSubmitting.value = true;

		try {
			let { data } = await api.post('/posts', {
				title: title.value,
				content: content.value
			});

			notyf.success("Post published");

			// go to the new post
			router.push('/posts/' + data.result._id);

		} catch(e) {
			console.log(e);
			notyf.error(e.response && e.response.data && e.response.data.message ? e.response.data.message : "Cannot publish the post");
		} finally {
			isSubmitting.value = false;
		}
	}
</script>

<template>
	<div class="page page-small">
		<h1>Write a post</h1>

		<form v-on:submit="handleSubmit">
			<div class="mb-3">
				<label for="title" class="form-label">Title</label>
				<input type="text" class="form-control" id="title" v-model="title" maxlength="150" />
			</div>
			<div class="mb-3">
				<label for="content" class="form-label">Content</label>
				<textarea class="form-control" id="content" rows="12" v-model="content"></textarea>
				<div class="form-text">Leave a blank line to start a new paragraph.</div>
			</div>
			<button type="submit" class="btn btn-teal me-2" :disabled="isSubmitting">{{ isSubmitting ? 'Publishing...' : 'Publish' }}</button>
			<router-link to="/posts" class="btn btn-outline-primary">Cancel</router-link>
		</form>
	</div>
</template>
