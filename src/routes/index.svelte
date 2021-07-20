<script context="module">
	export const prerender = true;
</script>

<script>

</script>

<svelte:head>

	<title>Home</title>

</svelte:head>

<section>

	<h1>
		<div class="welcome">
			Hathi Trust Similarities
		</div>
	</h1>

	<h2>

		This is a Svelte-kit app serving a duckdb database from Ben's home computer.
		I am retyping the data here. It refreshes on its own.

	</h2>

</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

</style>
