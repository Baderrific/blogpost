<script setup>
	// post is one post from the server
	const props = defineProps({
		post: Object
	});

	// format the date, example: October 26, 2026
	function formatDate(date) {
		return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
	}

	// show only the first part of the content
	function shortContent(text) {
		if(text.length > 160) {
			return text.slice(0, 160) + '...';
		}
		return text;
	}
</script>

<template>
	<div class="post-item">
		<h3>
			<router-link :to="'/posts/' + post._id">{{ post.title }}</router-link>
		</h3>
		<p class="post-info">
			<i class="bi bi-person"></i> {{ post.author ? post.author.username : 'Deleted user' }}
			&nbsp;&nbsp;
			<i class="bi bi-calendar3"></i> {{ formatDate(post.createdAt) }}
		</p>
		<p class="post-preview">{{ shortContent(post.content) }}</p>

		<!-- buttons from the page that uses this component go here -->
		<slot></slot>
	</div>
</template>
