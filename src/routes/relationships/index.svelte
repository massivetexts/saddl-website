<script context="module">
</script>

<script>
import { onMount } from "svelte";
import { Circle2 } from 'svelte-loading-spinners';
const encode = (str) => encodeURIComponent(str.replaceAll("/", "===="))


let my_ids = undefined;
onMount( () => {
  const url = "/relationships/random.json";
  my_ids = fetch(url)
  .then(
    response => response.json()
  );
})
</script>

<h1>Random Relationships</h1>

For now, I'm just fetching a bunch of random HTIDs.
{#if my_ids}
{#await my_ids}
	<Circle2></Circle2>
{:then id_list}
	{#each id_list as id}
    <a href="/relationships/{encode(id.htid)}/">    
      {id.title} - {id.author}
    </a>
    {/each}
{/await}
{/if}