<script context="module">
</script>

<script>
  import { onMount } from "svelte";
  import { Circle2 } from "svelte-loading-spinners";
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
    <div class="row">
      {#each id_list as id, i}
        <VolumeCard meta={id} />
      {/each}
    </div>
  {/await}
{/if}
