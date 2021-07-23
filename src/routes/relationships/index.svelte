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
    <hr />
    {#each { length: Math.ceil(id_list.length / 3) } as _, i}
      <div class="row">
        <VolumeCard meta={id_list[i * 3]} />
        {#if i * 3 + 1 < id_list.length}
          <VolumeCard meta={id_list[i * 3 + 1]} />
        {/if}
        {#if i * 3 + 2 < id_list.length}
          <VolumeCard meta={id_list[i * 3 + 2]} />
        {/if}
      </div>
    {/each}
    <hr />
  {/await}
{/if}
