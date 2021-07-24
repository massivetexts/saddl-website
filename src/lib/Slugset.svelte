<script>
  export let items;
  export let level = "volume";
  //export let title;
  import VolumeCard from "$lib/VolumeCard.svelte";
  let col_count = 3;
</script>

<!--For tiling, this creates rows of three-->
{#each { length: Math.ceil(items.length / col_count) } as _, i}
  <div class="row">
    {#each { length: col_count } as _, j}
      {#if i * col_count + j < items.length}
        {#if level === "volume"}
          <VolumeCard meta={items[i * col_count + j]} />
        {:else}
          <p>This level not implemented yet.</p>
        {/if}
      {/if}
    {/each}
  </div>
{/each}
