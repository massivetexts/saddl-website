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

  //empty promises full of regret.
  let relationships = new Promise(() => {});
  let work_data = new Promise(() => {});
  let partials = [];

  onMount(async () => {
    // Can't run until page is mounted.
    const res = await fetch(`/relationships/htid/${htid}.json`);
    relationships = await res.json();
    partials = []
      .concat(relationships.relationships.overlaps)
      .concat(relationships.relationships.contains)
      .concat(relationships.relationships.is_part_of);
    work_data = fetch(`/catalog/htid/${htid}.json`).then((d) => d.json());
  });

  // TODO Updates to volume title when it loads
  $: title = `Volume: ${htid}`;

  const organized = {};
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

{#await work_data}
  <Circle2 />
{:then metadata}
  <div class="row" style="margin-top: 5%">
    <div class="nine columns">
      <!-- If no description, don't include -->
      <h2>
        {metadata.title}
        {#if metadata.description}({metadata.description}){/if}
      </h2>
    </div>
    <div class="three columns">
      <dl class="ids">
        <dt>Work</dt>
        <dd><a href="/relationships/work/{metadata.work_id}">SADDL-W{metadata.work_id}</a></dd>
        <dt>Manifestation</dt>
        <dd><a href="/relationships/man/{metadata.man_id}">SADDL-M{metadata.man_id}</a>.</dd>
        <dt>HathiTrust ID</dt>
        <dd>
          <a target="_blank" href="https://hdl.handle.net/2027/{decode(metadata.htid)}"> {metadata.htid}</a>
        </dd>
      </dl>
    </div>
  </div>

  <div class="row">
    <div class="one-half column">
      <dl class="info-list">
        <dt>Author</dt>
        <dd>{metadata.author}</dd>
        <dt>Year</dt>
        <dd>{metadata.rights_date_used}</dd>
        <dt>OCLC Number</dt>
        <dd>{metadata.oclc_num}</dd>
      </dl>
      <details class="more">
        <summary>More</summary>
        <dl>
          {#each Object.keys(metadata) as k}
            {#if !["author", "htid", "title", "work_id", "man_id", "rights_date_used", "oclc_num"].includes(k) && metadata[k]}
              <dt>{k}</dt>
              <dd>{metadata[k]}</dd>
            {/if}
          {/each}
        </dl>
      </details>
    </div>

    {#await relationships}
      <Circle2 />
    {:then data}
      <div class="one-half column">
        <dl>
          {#if data.related_metadata.years.length}
            <dt>Other years</dt>
            {#each data.related_metadata.years.filter((x) => x != metadata.rights_date_used) as year}
              <dd>{year}</dd>
            {/each}
          {/if}
          {#if data.related_metadata.oclc.length}
            <!--TODO if oclc numbers overlap with metadata, the previous if doesn't work properly-->
            <dt>Other OCLC numbers</dt>
            {#each data.related_metadata.oclc.filter((x) => x != metadata.oclc_num) as oclc}
              <dd>{oclc}</dd>
            {/each}
          {/if}
          {#if data.related_metadata.titles.length}
            <dt>Other titles</dt>
            {#each data.related_metadata.titles.filter((x) => x != metadata.title) as title}
              <dd>{title}</dd>
            {/each}
          {/if}
        </dl>
        <details class="more">
          <summary>What's this?</summary>
          These are other titles, years, and identifiers seen for volumes that are likely the same work.
        </details>
      </div>
    {/await}
  </div>
{/await}
<hr />

{#await relationships}
  <Circle2 />
{:then data}
  <!--<div id="relationlist" display="flex">
    {#each Object.keys(organized) as k}
      <Slugset items={organized[k]} title={k + organized[k].repr ? organized[k].repr : organized[k][0].title} />
    {/each}
  </div>-->
  <!-- Identical Works -->
  {#if data.relationships.identical_works.length}
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
    <Slugset items={data.relationships.identical_works} />
    <hr />
  {/if}
  <!-- End identical works -->
  {#if data.relationships.other_expressions.length}
    <div class="row">
      <div class="one-half column">
        <h3>Other Work Instances</h3>
      </div>
      <div class="one-half column">
        <p>
          These volumes have the same <em>work</em> - that is, the underlying artistic expression - though not
          necessarily in an identical version or printing. In FRBR, these may be different <em>expressions</em> and
          <em>manifestions</em> of a work..
        </p>
      </div>
    </div>
    <Slugset items={data.relationships.other_expressions} />
    <hr />
  {/if}

  {#if data.relationships.other_volumes.length}
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
    <Slugset items={data.relationships.other_volumes} />
    <hr />
  {/if}

  {#if partials.length}
    <div class="row">
      <div class="one-half column">
        <h3>Partial Overlaps</h3>
      </div>
      <div class="one-half column">
        <p>
          These volumes <em>contain</em>, <em>are part of</em>, or <em>overlap</em> with <a>Sample Title (v. 2)</a>.
        </p>
      </div>
    </div>

    <Slugset items={partials} />

    <hr />
  {/if}
  {#if relationships.recommendations.books.length}
    <div class="row">
      <div class="one-half column">
        <h3>Recommendations</h3>
      </div>
      <div class="one-half column">
        These are content-based recommendations, based on similar <em>topics</em> and <em>themes</em> as the target book.
        They don't factor a book's popularity or quality, making them a good complement to expert or reader recommendations.
      </div>
    </div>

    <Slugset items={relationships.recommendations.books} />

    <hr />
  {/if}
  <div class="row">
    <div class="one-half column">
      <h3>Download</h3>
      <ul>
        <li><a download="{htid}.saddl.js" href="/relationships/htid/{htid}.json">Download JSON dataset file.</a></li>
        <li><a target="_blank" href="/relationships/htid/{htid}.json">Open in browser.</a></li>
        <li><a target="_blank" href="https://github.com/massivetexts/saddl-dataset">Full SaDDL dataset.</a></li>
      </ul>
    </div>
  </div>
{/await}

<style>
  details.more summary {
    /*border-top: 1px solid #fcc;*/
    font-size: 11px;
    letter-spacing: 0.2rem;
    text-decoration: none;
    color: #444;
    font-weight: 500;
  }

  dl dd {
    margin-inline-start: 5px;
  }

  summary {
    display: list-item;
    cursor: pointer;
  }

  details.more {
    /*background: #fffafa;*/
  }
  .external_link {
    text-decoration: none;
    color: var(--heading-color);
  }
  .more dl {
    margin: 0.5rem 0 1rem 1rem;
  }

  dt {
    font-weight: 700;
    font-size: 90%;
  }

  dd {
    font-size: 85%;
  }

  details.related-info {
    font-size: 80%;
    color: #555;
  }
</style>
