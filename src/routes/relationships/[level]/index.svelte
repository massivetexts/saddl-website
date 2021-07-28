<script context="module">
</script>

<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { Circle2 } from "svelte-loading-spinners";
  import Slugset from "$lib/Slugset.svelte";

  let my_ids = new Promise(() => {});
  const level = $page.params.level;
  onMount(async () => {
    const res = fetch(`/relationships/${level}/random.json`);
    my_ids = await res.json();
  });
</script>

<svelte:head>
  <title>Volumes</title>
</svelte:head>

{#if level == "work"}
  <h1>Random Works</h1>

  A<em>work</em> is the conceptual representation of a book's content. Books that are the same 'work' may be different editions,
  versions, or printings of the same story or content.
{:else if level == "htid"}
  <h1>Random Books</h1>
{/if}

{#if my_ids}
  {#await my_ids}
    <Circle2 />
  {:then id_list}
    <hr />
    <Slugset {level} items={id_list} />
    <hr />
  {/await}
{/if}
