<script context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
</script>

<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { Circle2 } from "svelte-loading-spinners";
  const level = $page.params.level;
  const id = $page.params.id;

  let lookup_list = new Promise(() => {});
  onMount(() => {
    lookup_list = fetch(`/catalog/htid/${id}.json`).then((d) => d.json());
  });
</script>

<h1 />
<a href="/relationships/htid/{id}">Relationships</a>

{#await lookup_list}
  <Circle2 />
{:then hathifiles_info}
  <details>
    <summary>{hathifiles_info.author}, {hathifiles_info.title}</summary>
    <dl>
      {#each Object.keys(hathifiles_info) as k}
        <dt>{k}</dt>
        {#if k == "date"}
          DATE!
        {:else}
          <dd>{hathifiles_info[k]}</dd>
        {/if}
      {/each}
    </dl>
  </details>
{/await}
