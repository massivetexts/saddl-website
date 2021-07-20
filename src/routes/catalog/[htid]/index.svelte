<script context="module">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */

</script>

<script>
import { page } from '$app/stores';
import { onMount } from 'svelte';
import { Circle2 } from 'svelte-loading-spinners';
const htid = $page.params.htid

let lookup_list = new Promise(() => {})

onMount(() => {
	lookup_list = fetch(`/catalog/${htid}.json`).then(d => d.json());

})

</script>

<h1>

</h1>

{#await lookup_list}
	<Circle2 />
{:then hathifiles_info}
	<details>

	<summary>{hathifiles_info.author}, {hathifiles_info.title}</summary>

	<dl>
		{#each Object.keys(hathifiles_info) as k}
			<dt>{k}</dt>
			{#if k=="date"}
			DATE!
			{:else}
			<dd>{hathifiles_info[k]}</dd>
			{/if}
		{/each}
	</dl>
	</details>
{/await}
