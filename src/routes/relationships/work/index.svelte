<script context="module">
</script>

<script>
  import { onMount } from "svelte";
  import { Circle2 } from "svelte-loading-spinners";
  import Slugset from "$lib/Slugset.svelte";

  let my_ids = undefined;
  onMount(() => {
    const url = "/relationships/work/random.json";
    my_ids = fetch(url).then((response) => response.json());
  });
</script>

<svelte:head>
  <title>Works</title>
</svelte:head>

<h1>Random Works</h1>

A<em>work</em> is the conceptual representation of a book's content. Books that are the same 'work' may be different
editions, versions, or printings of the same story or content.

{#if my_ids}
  {#await my_ids}
    <Circle2 />
  {:then id_list}
    <hr />
    <Slugset items={id_list} level="work" />
    <hr />
  {/await}
{/if}
