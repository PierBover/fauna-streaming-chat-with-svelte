<script>
	import {afterUpdate} from 'svelte';
	import {messages, authorName, authorColor} from '../store/index.js';
	import ChatForm from "./ChatForm.svelte";
	
	let messagesDiv;
	
	// Scroll the div to the bottom whenever the component updates
	afterUpdate(async () => {
		messagesDiv.scrollTop = messagesDiv.scrollHeight;
	});
</script>

<div id="App">
	<div class="messages" bind:this={messagesDiv}>
		{#each $messages as message}
			<div class="message"><strong style="color:{message.authorColor};">{message.authorName}</strong>: {message.message}</div>
		{/each}
	</div>
	<ChatForm/>
</div>
<div>
	You're writing as <strong style="color:{authorColor};">{authorName}</strong>
</div>

<style>
	#App {
		width: 30rem;
		margin-bottom: 1rem;
	}
	
	.messages {
		height: 20rem;
		overflow: hidden;
		padding: 1.5rem;
		overflow-y: scroll;
		box-sizing: border-box;
		background-color: white;
		margin-bottom: 1rem;
		border: 1px solid #aaa;
	}
	
	.message {
		margin-bottom: .75rem;
	}
</style>