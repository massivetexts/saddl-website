<script context="module">

</script>

<script>

  import { page } from "$app/stores";
  import { Circle2 } from 'svelte-loading-spinners';
  import { onMount } from 'svelte'
  // An encoded URI component.

  const htid = $page.params.htid;

  //empty promises.
  let relationships = new Promise(() => {})
  let work_data = new Promise(() => {})

  onMount(() => {
    // Can't run until page is mounted.
    relationships = fetch(`/relationships/${htid}.json`).then(d => d.json())
    work_data = fetch(`/catalog/${htid}.json`).then((d) => d.json())
  })

  const encode = (str) => encodeURIComponent(str.replaceAll("/", "===="))

  const organized = {};

   $ : relationships.then((vals) => {
    console.log(vals);
    vals.sort((a, b) => b.relatedness - a.relatedness);
    for (let rel of vals) {
      // prettier-ignore
      let probs = (function({ swsm, swde, wp_dv, partof, contains, OVERLAPS, simdiff, grsim, randdiff }) {
        return {swsm, swde, wp_dv, partof, contains, OVERLAPS, simdiff, grsim, randdiff }
      })(rel);
      let guess = Object.keys(probs).reduce((x, y) =>
        probs[x] > probs[y] ? x : y
      );
      if (!organized[guess]) {
        organized[guess] = [];
      }
      organized[guess].push(rel);
    }
  });
</script>

{#await work_data}
  <Circle2 />
{:then metadata}
  <h1>{metadata.title}</h1>
  {metadata.author}
{/await}

<a href="/catalog/${encode(htid)}/"> Catalog page</a>

{#await relationships}
  <Circle2 />
{:then}
  <ul>
    {#each Object.keys(organized) as k}
      <li>
        {k}
        <ul>
          {#each organized[k] as rel}
            <li>
              <a href="/catalog/{encode(rel.htid)}">{rel.title} - {rel.htid}</a>
            </li>
          {/each}
        </ul>
      </li>
    {/each}
  </ul>
{/await}
