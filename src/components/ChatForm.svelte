<script>
	import {createMessage} from '../fauna/index.js';
	import {authorName, authorColor} from "../store/index.js";
	
	let message;
	
	function onSubmit () {
		createMessage(authorName, authorColor, message);
		message = '';
	}
</script>

<form on:submit|preventDefault={onSubmit}>
	<input type="text" bind:value={message} required>
	<button type="submit">Send</button>
</form>

<style>
	form {
		display: flex;
	}
	
	input {
		width: 100%;
		margin-right: .25rem;
	}
</style>