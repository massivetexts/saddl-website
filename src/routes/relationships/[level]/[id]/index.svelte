<script context="module">
</script>

<script>
  import { page } from "$app/stores";
  import { Circle2 } from "svelte-loading-spinners";
  import { onMount } from "svelte";
  import { decode } from "$lib/utils.js";
  import MetadataList from "$lib/MetadataList.svelte";
  import Slugset from "$lib/Slugset.svelte";

  // An encoded URI component.
  $: level = $page.params.level;
  $: id = $page.params.id;

  let pretty_name;
  $: if (level === "htid") {
    pretty_name = "book";
  } else if (level == "man") {
    pretty_name = "manifestation";
  } else if (level == "work") {
    pretty_name = "work";
  }

  //empty promises full of regret.
  let relationships = new Promise(() => {});
  let work_data = new Promise(() => {});
  let partials = [];

  let mounted = false;
  onMount(() => (mounted = true));

  const get_data = async function (level) {
    // Can't run until page is mounted.
    const res = await fetch(`/relationships/${level}/${id}.json`);
    relationships = await res.json();
    partials = []
      .concat(relationships.relationships.overlaps)
      .concat(relationships.relationships.contains)
      .concat(relationships.relationships.is_part_of);
    work_data = fetch(`/catalog/${level}/${id}.json`).then(function (d) {
      let data = d.json();
      if (!("members" in data)) {
        data.members = [];
      }
      return data;
    });
  };

  $: if (mounted) {
    get_data(level);
  }

  // Header sizing
  const header_size = function (title_length) {
    let size;
    if (title_length < 100) {
      size = 3.5;
    } else if (title_length > 500) {
      size = 2;
    } else {
      size = 3.5 - (1.5 * (title_length - 100)) / (400 - 100);
    }
    return size.toString() + "rem";
  };

  // TODO reactive title to include a book name after metadata loads
  let title;
  $: if (level == "work") {
    title = `SADDL-W${id}`;
  }
  $: if (level == "man") {
    title = `SADDL-M${id}`;
  } else if (level == "htid") {
    title = `Volume ${id}`;
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

{#await work_data}
  <Circle2 />
{:then { metadata, members }}
  <div class="row" style="margin-top: 5%">
    <div class="nine columns">
      <!-- If no description, don't include -->

      {#if level == "work"}
        <h2>Work: SADDL-W{id}</h2>
        <p>
          A collection of {metadata.label_count} scanned books that all contain "{metadata.title}"
          {#if metadata.description}({metadata.description}){/if}
          {#if metadata.author}
            by <em>{metadata.author}</em>{/if}.
        </p>
      {:else if level == "man"}
        <h2>Manifestation: SADDL-M{id}</h2>
        <p>
          A collection of {metadata.label_count} scanned books that all contain "{metadata.title}"
          {#if metadata.description}({metadata.description}){/if}
          {#if metadata.author}
            by <em>{metadata.author}</em>{/if}.
        </p>
      {:else}
        <h2 style="font-size: {header_size(metadata.title.length)};">
          {metadata.title}
          {#if metadata.description}({metadata.description}){/if}
        </h2>
      {/if}
    </div>
    <div class="three columns">
      <dl class="ids">
        {#if level != "work"}
          <dt>Work</dt>
          <dd><a href="/relationships/work/{metadata.work_id}">SADDL-W{metadata.work_id}</a></dd>
        {/if}
        {#if level != "man"}
          <dt>Manifestation</dt>
          <dd><a href="/relationships/man/{metadata.man_id}">SADDL-M{metadata.man_id}</a>.</dd>
        {/if}
        <dt>HathiTrust ID</dt>
        <dd>
          <a target="_blank" href="https://hdl.handle.net/2027/{decode(metadata.htid)}"> {metadata.htid}</a>
        </dd>
      </dl>
    </div>
  </div>

  <div class="row">
    <div class="three columns">
      <MetadataList {metadata} />
    </div>

    {#await relationships}
      <Circle2 />
    {:then data}
      <div class="nine columns">
        <dl>
          {#if data.related_metadata.years.length}
            <dt>Other years</dt>
            <dd>{data.related_metadata.years.filter((x) => x != metadata.rights_date_used).join(", ")}</dd>
          {/if}
          {#if data.related_metadata.oclc.length}
            <!--TODO if oclc numbers overlap with metadata, the previous if doesn't work properly-->
            <dt>Other OCLC numbers</dt>
            <dd>{data.related_metadata.oclc.filter((x) => x != metadata.oclc_num).join(", ")}</dd>
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
  {#if level == "work" || level == "man"}
    <hr />
    <!-- TODO #11 make list of work members into a table -->
    <div class="row">
      <div class="one-half column">
        <h3>Books in this {pretty_name.charAt(0).toUpperCase() + pretty_name.slice(1)}</h3>
      </div>
      <div class="one-half column">
        <p>These are the books in this set.</p>
      </div>
    </div>
    <Slugset items={members} />
  {/if}
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
          These volumes are likely an identical printing (i.e. same <em>manifestion</em> in
          <a target="_blank" href="https://en.wikipedia.org/wiki/Functional_Requirements_for_Bibliographic_Records"
            >FRBR</a
          >). The
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
        <h3>Other Books With this Work</h3>
      </div>
      <div class="one-half column">
        <p>
          These books publish the same <em>work</em> - that is, the underlying artistic expression - though not
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
        <h3>Different Volumes of This {pretty_name.charAt(0).toUpperCase() + pretty_name.slice(1)}</h3>
      </div>
      <div class="one-half column">
        <p>
          These are {pretty_name}s that are likely different volumes of the same target work. Note that these inferences
          are made based on the <em>content</em> of {#if level == "book"}the book{:else}all the books in the {pretty_name}{/if},
          so it's good to consider the judgments in relation to the metadata also.
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
          {#await work_data}
            <Circle2 />
          {:then metadata}
            These {pretty_name}s <em>contain</em>, <em>are part of</em>, or <em>overlap</em> with
            {#if level == "htid"}
              <em>
                {metadata.title}
                {#if metadata.description}({metadata.description}){/if}
              </em>
            {:else if level == "work"}<em>SADDL-W{metadata.work_id}</em>
            {:else if level == "man"}<em>SADDL-M{metadata.man_id}</em>
            {/if}
            .
          {/await}
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
        These are content-based recommendations, based on similar <em>topics</em> and <em>themes</em> as the target {pretty_name}.
        They don't factor book popularity or quality, making them a good complement to expert or reader recommendations.
      </div>
    </div>

    <Slugset items={relationships.recommendations.books} confidence={false} />

    <hr />
  {/if}
  <div class="row">
    <div class="one-half column">
      <h3>Download</h3>
      <ul>
        <li><a download="{id}.saddl.js" href="/relationships/{level}/{id}.json">Download JSON dataset file.</a></li>
        <li><a target="_blank" href="/relationships/{level}/{id}.json">Open JSON in browser.</a></li>
        <li><a target="_blank" href="https://github.com/massivetexts/saddl-dataset">Full SaDDL dataset.</a></li>
      </ul>
    </div>
  </div>
{/await}

<style>
  summary {
    display: list-item;
    cursor: pointer;
  }
  dt {
    font-weight: 700;
    font-size: 90%;
  }

  dd {
    font-size: 85%;
    margin-inline-start: 5px;
  }
</style>
