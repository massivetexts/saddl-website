<script>
  export let items;
  //export let title;
  import VolumeCard from "$lib/VolumeCard.svelte";
</script>

<!--For tiling, this creates rows of three-->
{#each { length: Math.ceil(items.length / 3) } as _, i}
  <div class="row">
    <VolumeCard meta={items[i * 3]} />
    {#if i * 3 + 1 < items.length}
      <VolumeCard meta={items[i * 3 + 1]} />
    {/if}
    {#if i * 3 + 2 < items.length}
      <VolumeCard meta={items[i * 3 + 2]} />
    {/if}
  </div>
{/each}
