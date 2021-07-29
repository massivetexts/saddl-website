<script context="module">
</script>

<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { Circle2 } from "svelte-loading-spinners";
  import Slugset from "$lib/Slugset.svelte";

  $: level = $page.params.level;

  let my_ids = [];
  const get_data = async function (level) {
    const res = await fetch(`/relationships/${level}/random.json`);
    return await res.json();
  };
  let mounted = false;
  onMount(() => (mounted = true));
  $: if (mounted) {
    my_ids = get_data(level);
  }
</script>

<svelte:head>
  <title>Volumes</title>
</svelte:head>

{#if level == "work"}
  <h1>Random Works</h1>

  A<em>work</em> is the conceptual representation of a book's content. Books that are the same 'work' may be different editions,
  versions, or printings of the same story or content.
{:else if level == "man"}
  <h1>Random Manifestations</h1>

  A<em>manifestation</em> is a physical embodiment of a work. Books that are the same 'manifestation' are assumed to be exact
  duplicates.
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
