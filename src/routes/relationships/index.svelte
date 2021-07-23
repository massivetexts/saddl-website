<script context="module">
</script>

<script>
  import { onMount } from "svelte";
  import { Circle2 } from "svelte-loading-spinners";
  import Slugset from '$lib/Slugset.svelte';
  import VolumeCard from "$lib/VolumeCard.svelte";

  let my_ids = undefined;
  onMount(() => {
    const url = "/relationships/random.json";
    my_ids = fetch(url).then((response) => response.json());
  });
</script>

<svelte:head>
  <title>Relationships</title>
</svelte:head>

<h1>Random Relationships</h1>

For now, I'm just fetching a bunch of random HTIDs.
{#if my_ids}
  {#await my_ids}
    <Circle2 />
  {:then id_list}
    <Slugset items={id_list} />
  {/await}
{/if}
