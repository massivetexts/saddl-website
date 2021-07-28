<script>
  export let metadata;
  export let featured = ["label_count", "author", "rights_date_used", "oclc_num", "htid", "description"]; // metadata fields to feature above the fold
  let pretty_names = {
    author: "Author",
    oclc_num: "OCLC",
    rights_date_used: "Year",
    description: "Description",
    label_count: "# of books in this set",
  };
  //prettier-ignore
  let always_exclude = [
    "title", "work_id", "man_id", "rights_date_used", "oclc_num",
    "target", "candidate", "swsm", "swde", "wp_dv", "partof", "contains",
    "overlaps", "authorclass", "simdiff", "grsim", "randdiff",
    "relatedness", "count", "confidence", "guess", "sw", "diff", "include"
  ];
  let exclude = [].concat(always_exclude, featured);
</script>

<!--prettier ignore-->
<dl class="info-list">
  {#each featured as k}
    {#if metadata[k]}
      <dt>{pretty_names[k] ? pretty_names[k] : k}</dt>
      <dd>{metadata[k]}</dd>
    {/if}
  {/each}
  {#if metadata.guess && ["contains", "partof", "overlaps"].includes(metadata.guess)}
    <dt>Relationship</dt>
    <dd>{metadata.guess.toUpperCase()}</dd>
  {/if}
</dl>
<!--ugly-->
{#if Object.keys(metadata).filter((x) => !exclude.includes(x)).length}
  <details class="more">
    <summary>More</summary>
    <dl>
      {#each Object.keys(metadata).filter((x) => !exclude.includes(x)) as k}
        <dt>{pretty_names[k] ? pretty_names[k] : k}</dt>
        <dd>{metadata[k]}</dd>
      {/each}
    </dl>
  </details>
{/if}

<style>
  details.more summary {
    /*border-top: 1px solid #fcc;*/
    font-size: 11px;
    letter-spacing: 0.2rem;
    text-decoration: none;
    color: #444;
    font-weight: 500;
  }

  summary {
    display: list-item;
    cursor: pointer;
  }

  details.more {
    /*background: #fffafa;*/
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
    margin-inline-start: 5px;
  }
</style>
