<script>
  export let meta;
  export let confidence = true; // whether to include confidence component
  export let level = "htid";
  export let colwidth = "four";
  export let rightBorder = false;
  import { encode } from "$lib/utils.js";
  import ConfidenceIndicator from "$lib/ConfidenceIndicator.svelte";
  import MetadataList from "$lib/MetadataList.svelte";
  let confidenceOpacity = 1;
  if (meta.confidence && meta.confidence < 0.5) {
    confidenceOpacity = meta.confidence * 2;
  }
  $: cssVarStyles = `--confidence-opacity:${confidenceOpacity}`;
  let slug;

  $: if (level === "htid") {
    slug = "htid/" + encode(meta.htid);
  } else if (level === "work") {
    slug = "work/" + meta.work_id;
  } else if (level === "man") {
    slug = "man/" + meta.man_id;
  }
</script>

<div class="{colwidth} columns volumeCard {rightBorder ? 'right-border' : ''}" style={cssVarStyles}>
  <p>
    <strong>
      <a href="/relationships/{slug}/">
        {meta.title}
        {#if meta.rights_date_used}({meta.rights_date_used}){/if}
      </a>
    </strong>
  </p>
  {#if meta.best_copy || meta.best_copy_pd || meta.access}
    <ul class="tags">
      {#if meta.best_copy_pd && !meta.best_copy}
        <li><a target="_blank" href="https://hdl.handle.net/2027/{meta.htid}">Best Full View Copy</a></li>
      {:else}
        {#if meta.best_copy}<li>Best Copy</li>{/if}
        {#if meta.access === "allow"}<li>
            <a target="_blank" href="https://hdl.handle.net/2027/{meta.htid}">Full View Available</a>
          </li>{/if}
      {/if}
    </ul>
  {/if}
  <MetadataList metadata={meta} />
  {#if confidence && meta.confidence}<ConfidenceIndicator confidence={meta.confidence} />{/if}
</div>

<style>
  ul.tags {
    display: inline;
  }
  ul.tags li {
    padding: 2px 5px;
    background-color: antiquewhite;
    display: inline-block;
    border-radius: 5px;
    font-size: 80%;
  }
  .volumeCard {
    opacity: var(--confidence-opacity, 1);
    margin-bottom: 20px;
    padding: 6px;
  }
  .right-border {
    border-right: 1px solid #eee;
  }
</style>
