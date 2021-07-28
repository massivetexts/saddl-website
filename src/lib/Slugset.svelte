<script>
  export let items;
  export let level = "htid";
  export let col_count = 3;
  export let confidence;
  //export let title;
  import VolumeCard from "$lib/VolumeCard.svelte";

  let colwidth_ref = {
    1: "twelve",
    2: "six",
    3: "four",
    4: "three",
  };
</script>

<!--For tiling, this creates rows of three-->
{#each { length: Math.ceil(items.length / col_count) } as _, i}
  <div class="row">
    {#each { length: col_count } as _, j}
      {#if i * col_count + j < items.length}
        <VolumeCard {confidence} colwidth={colwidth_ref[col_count]} meta={items[i * col_count + j]} {level} />
      {/if}
    {/each}
  </div>
{/each}
