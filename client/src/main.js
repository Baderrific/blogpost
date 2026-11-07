import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import 'notyf/notyf.min.css';
import './assets/main.css'

import { createApp } from 'vue';
import { Notyf } from 'notyf';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue'

import PostsPage from './pages/PostsPage.vue';
import PostDetailsPage from './pages/PostDetailsPage.vue';
import CreatePostPage from './pages/CreatePostPage.vue';
import EditPostPage from './pages/EditPostPage.vue';
import MyPostsPage from './pages/MyPostsPage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import LoginPage from './pages/LoginPage.vue';
import LogoutPage from './pages/LogoutPage.vue';
import ErrorPage from './pages/ErrorPage.vue';

const notyf = new Notyf();

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', redirect: '/posts' },
		{ path: '/posts', name: 'Posts', component: PostsPage },
		{ path: '/posts/:postId', name: 'PostDetails', component: PostDetailsPage },
		{ path: '/posts/:postId/edit', name: 'EditPost', component: EditPostPage },
		{ path: '/write', name: 'Write', component: CreatePostPage },
		{ path: '/my-posts', name: 'MyPosts', component: MyPostsPage },
		{ path: '/register', name: 'Register', component: RegisterPage },
		{ path: '/login', name: 'Login', component: LoginPage },
		{ path: '/logout', name: 'Logout', component: LogoutPage },
		// any other url shows the error page
		{ path: '/:catchAll(.*)', component: ErrorPage }
	]
})

// this runs before every page change
router.beforeEach((to, from, next) => {

	const token = localStorage.getItem('token');

	// these pages are only for logged in users
	const privatePages = ['Write', 'EditPost', 'MyPosts'];

	if(privatePages.includes(to.name) && !token) {
		notyf.error("Please login first");
		next('/login');

	// logged in users do not need the login and register page
	} else if((to.name === 'Login' || to.name === 'Register') && token) {
		next('/posts');

	} else {
		next();
	}
})

const app = createApp(App)
app.use(createPinia());
app.use(router);
app.mount('#app')
