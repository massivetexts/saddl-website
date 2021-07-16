<script context="module">
  export async function load({ page, fetch }) {
    const url = `/relationships/${page.params.htid}.json`;
    try {
      const res = await fetch(url);
      const dat = res.json();
      return {
        props: {
          relationships: dat,
        },
      };
    } catch {
      return {
        //        status: res.status,
        error: new Error(`Could not load ${url}`),
      };
    }
  }
</script>

<script>
  export let relationships;
  import { page } from "$app/stores";

  const organized = {};
  relationships.then((vals) => {
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
  const work_data = fetch(`/catalog/${$page.params.htid}.json`).then((d) =>
    d.json()
  );
</script>

{#await work_data}
  <h1 />
{:then metadata}
  <h1>{metadata.title}</h1>
  {metadata.author}
{/await}

<a href="/catalog/{$page.params.htid}/"> Catalog page</a>

{#await relationships}
  Waiting
{:then}
  <ul>
    {#each Object.keys(organized) as k}
      <li>
        {k}
        <ul>
          {#each organized[k] as rel}
            <li>
              <a href="/catalog/{rel.htid}">{rel.title} - {rel.htid}</a>
            </li>
          {/each}
        </ul>
      </li>
    {/each}
  </ul>
{/await}
