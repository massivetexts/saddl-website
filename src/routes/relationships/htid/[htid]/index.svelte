<script context="module">
</script>

<script>
  import { page } from "$app/stores";
  import { Circle2 } from "svelte-loading-spinners";
  import { onMount } from "svelte";
  import { encode, decode } from "$lib/utils.js";
  import Slugset from "$lib/Slugset.svelte";
  // An encoded URI component.
  const htid = $page.params.htid;

  //empty promises.
  let relationships = new Promise(() => {});
  let work_data = new Promise(() => {});

  onMount(() => {
    // Can't run until page is mounted.
    relationships = fetch(`/relationships/htid/${htid}.json`).then((d) => d.json());
    work_data = fetch(`/catalog/htid/${htid}.json`).then((d) => d.json());
  });

  const organized = {};

  $: relationships.then((vals) => {
    vals.sort((a, b) => b.relatedness - a.relatedness);
    for (let rel of vals) {
      // prettier-ignore
      let probs = (function({ swsm, swde, wp_dv, partof, contains, OVERLAPS, simdiff, grsim, randdiff }) {
        return {swsm, swde, wp_dv, partof, contains, OVERLAPS, simdiff, grsim, randdiff }
      })(rel);

      let guess = Object.keys(probs).reduce((x, y) => (probs[x] > probs[y] ? x : y));
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
  <div class="row" style="margin-top: 5%">
    <div class="twelve columns">
      <!-- If no description, don't include -->
      <h2>
        {metadata.title}
        {#if metadata.description}({metadata.description}){/if}
      </h2>
    </div>
  </div>
  <div class="row">
    <div class="six columns">
      <p>
        Work ID: <a href="/relationships/work/{metadata.work_id}">SADDL-W{metadata.work_id}</a>.
        <br />
        Manifestation ID:
        <a href="/relationships/man/{metadata.work_id}">SADDL-M{metadata.man_id}</a>.
      </p>
    </div>
    <div class="six columns">
      <p>
        See in <a href="https://hdl.handle.net/2027/{decode(metadata.htid)}">HathiTrust Digital Library</a>.<br />
        <a href="/catalog/htid/{encode(htid)}/">Catalog page</a>
      </p>
    </div>
  </div>

  <div class="row">
    <div class="one-half column">
      <h3>Volume Info</h3>

      <ul>
        <li>Author: {metadata.author}</li>
        <li>Rights Date Used: {metadata.rights_date_used}</li>
      </ul>
    </div>

    <div class="one-half column">
      <h3>Snapshot of Related Metadata</h3>
      <p>Other data.</p>
    </div>
  </div>
{/await}
<hr />

{#await relationships}
  <Circle2 />
{:then}
  <div id="relationlist" display="flex">
    {#each Object.keys(organized) as k}
      <Slugset items={organized[k]} title={k + organized[k].repr ? organized[k].repr : organized[k][0].title} />
    {/each}
  </div>
{/await}

<div class="row">
  <div class="one-half column">
    <h3>Identical Works</h3>
  </div>
  <div class="one-half column">
    <p>
      These volumes are likely an identical printing (i.e. same <em>manifestion</em> in <a>FRBR</a>). The
      <em>confidence</em> reflects the strength of the SADDL algorithm's resolve in that judgment.
    </p>
  </div>
</div>
<div class="row">
  <div class="three columns">
    <p><strong><a>Work Title (Year)</a></strong></p>
    <ul>
      <li>Description</li>
      <li>Author</li>
      <li>Confidence: 75%</li>
    </ul>
  </div>

  <div class="three columns">
    <p><strong><a>Work Title (Year)</a></strong></p>
    <ul>
      <li>Description</li>
      <li>Author</li>
      <li>Confidence: 75%</li>
    </ul>
  </div>

  <div class="three columns">
    <p><strong><a>Work Title (Year)</a></strong></p>
    <ul>
      <li>Description</li>
      <li>Author</li>
      <li>Confidence: 75%</li>
    </ul>
  </div>
</div>
<hr />
<div class="row">
  <div class="one-half column">
    <h3>Other Work Instances</h3>
  </div>
  <div class="one-half column">
    <p>
      These volumes have the same <em>work</em> - that is, the underlying artistic expression - though not necessarily
      in an identical version or printing. In FRBR, these may be different <em>expressions</em> and
      <em>manifestions</em> of a work..
    </p>
  </div>
</div>

<div class="row">
  <div class="three columns">
    <p><strong><a>Work Title (Year)</a></strong></p>
    <ul>
      <li>Description</li>
      <li>Author</li>
      <li>Confidence: 75%</li>
    </ul>
  </div>

  <div class="three columns">
    <p><strong><a>Work Title (Year)</a></strong></p>
    <ul>
      <li>Description</li>
      <li>Author</li>
      <li>Confidence: 75%</li>
    </ul>
  </div>

  <div class="three columns">
    <p><strong><a>Work Title (Year)</a></strong></p>
    <ul>
      <li>Description</li>
      <li>Author</li>
      <li>Confidence: 75%</li>
    </ul>
  </div>
</div>
<hr />
<div class="row">
  <div class="one-half column">
    <h3>Different Volumes of This Work</h3>
  </div>
  <div class="one-half column">
    <p>
      These are books that are likely different volumes of the same target work. Note that these inferences are made
      based on the <em>content</em> of the book, so it's good to consider the judgments in relation to the metadata also.
    </p>
  </div>
</div>
<hr />
<div class="row">
  <div class="one-half column">
    <h3>Partial Overlaps</h3>
  </div>
  <div class="one-half column">
    <p>These volumes <em>contain</em>, <em>are part of</em>, or <em>overlap</em> with <a>Sample Title (v. 2)</a>.</p>
  </div>
</div>

<div class="row">
  <div class="three columns">
    <p><strong><a>Work Title (Year)</a></strong></p>
    <ul>
      <li>Description</li>
      <li>Author</li>
      <li>Relationship: PARTOF</li>
      <li>Confidence: 75%</li>
    </ul>
  </div>

  <div class="three columns">
    <p><strong><a>Work Title (Year)</a></strong></p>
    <ul>
      <li>Description</li>
      <li>Author</li>
      <li>Relationship: CONTAINS</li>
      <li>Confidence: 75%</li>
    </ul>
  </div>

  <div class="three columns">
    <p><strong><a>Work Title (Year)</a></strong></p>
    <ul>
      <li>Description</li>
      <li>Author</li>
      <li>Relationship: OVERLAPS</li>
      <li>Confidence: 75%</li>
    </ul>
  </div>
</div>

<hr />
<div class="row">
  <div class="one-half column">
    <h3>Recommendations</h3>
  </div>
</div>
<hr />
<div class="row">
  <div class="one-half column">
    <h3>Download</h3>
  </div>
</div>

<style>
  #relationlist {
    flex-wrap: wrap;
  }
</style>
