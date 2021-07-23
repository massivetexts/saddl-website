<script>
  export let items;
  export let title;
  import Workslug from '$lib/WorkSlug.svelte';
</script>

<h3>{title}</h3>

<div class="slugset">
  {#each items as metadata}
    <Workslug {metadata} />
  {/each}
</div>


<style>
  .slugset {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 2em;
    background-color: aquamarine;
  }
</style>