<script>
  export let meta;
  import { encode } from "$lib/utils.js";
</script>

<div class="four columns">
  <p>
    <strong>
      <a href="/relationships/htid/{encode(meta.htid)}/"> {meta.title} ({meta.rights_date_used})</a>
    </strong>
  </p>
  <ul>
    {#if meta.description}<li>Description:{meta.description}</li>{/if}
    {#if meta.author}<li>Author: {meta.author}</li>{/if}
    {#if meta.confidence}<li>Confidence: {Math.round(meta.confidence * 100)}% ⬤</li>{/if}
  </ul>
</div>

<style>
</style>
