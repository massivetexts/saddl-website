<script>
  export let meta;
  import { encode } from "$lib/utils.js";
  import ConfidenceIndicator from "$lib/ConfidenceIndicator.svelte";

  let confidenceOpacity = 1;
  if (meta.confidence && meta.confidence < 0.5) {
    confidenceOpacity = meta.confidence * 2;
  }
  $: cssVarStyles = `--confidence-opacity:${confidenceOpacity}`;
</script>

<div class="four columns volumeCard" style={cssVarStyles}>
  <p>
    <strong>
      <a href="/relationships/htid/{encode(meta.htid)}/"> {meta.title} ({meta.rights_date_used})</a>
    </strong>
  </p>
  <ul>
    {#if meta.description}<li>Description:{meta.description}</li>{/if}
    {#if meta.author}<li>Author: {meta.author}</li>{/if}
    {#if meta.confidence}<li><ConfidenceIndicator confidence={meta.confidence} /></li>{/if}
  </ul>
</div>

<style>
  .volumeCard {
    opacity: var(--confidence-opacity, 1);
  }
</style>
