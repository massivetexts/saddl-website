<script context="module">
</script>

<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";

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
  <title>Search</title>
</svelte:head>

<div class="row">
  <div class="twelve columns">
    <h1>Search</h1>
    <p>This is a text-based search on titles and authors.</p>
  </div>
</div>
