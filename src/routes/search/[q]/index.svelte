<script context="module">
</script>

<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { Circle2 } from "svelte-loading-spinners";
  import Slugset from "$lib/Slugset.svelte";

  $: query = $page.params.q;
  $: title = query ? query : "Search";

  let my_ids = [];
  const get_data = async function (query) {
    const res = await fetch(`/search/${query}.json`);
    return await res.json();
  };
  let mounted = false;
  onMount(() => (mounted = true));
  $: if (mounted) {
    my_ids = get_data(query);
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="row">
  <div class="twelve columns">
    <h1>
      Search {#if query}: {query}{/if}
    </h1>
    <p>This is a text-based search on titles and authors.</p>
  </div>
</div>

{#if my_ids}
  {#await my_ids}
    <Circle2 />
  {:then id_list}
    <hr />
    <Slugset level="htid" col_count="2" items={id_list} />
    <hr />
  {/await}
{/if}
