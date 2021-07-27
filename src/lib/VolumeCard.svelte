<script>
  export let meta;
  export let confidence = true; // whether to include confidence component
  import { encode } from "$lib/utils.js";
  import ConfidenceIndicator from "$lib/ConfidenceIndicator.svelte";
  import MetadataList from "$lib/MetadataList.svelte";
  let confidenceOpacity = 1;
  if (meta.confidence && meta.confidence < 0.5) {
    confidenceOpacity = meta.confidence * 2;
  }
  $: cssVarStyles = `--confidence-opacity:${confidenceOpacity}`;
</script>

<div class="four columns volumeCard" style={cssVarStyles}>
  <p>
    <strong>
      <a href="/relationships/htid/{encode(meta.htid)}/">
        {meta.title}
        {#if meta.rights_date_used}({meta.rights_date_used}){/if}</a
      >
    </strong>
  </p>
  <MetadataList metadata={meta} />
  {#if confidence && meta.confidence}<ConfidenceIndicator confidence={meta.confidence} />{/if}
</div>

<style>
  .volumeCard {
    opacity: var(--confidence-opacity, 1);
  }
</style>
