<script>
  export let meta;
  const encode = (str) => encodeURIComponent(str.replaceAll("/", "===="));
</script>

<div class="four columns">
  <p>
    <strong>
      <a href="/relationships/work/{encode(meta.work_id.toString())}/"> {meta.title} ({meta.rights_date_used})</a>
    </strong>
  </p>
  <ul>
    <li># of volumes in this work: {meta.label_count}</li>
    <li>Description:{meta.description}</li>
    <li>Author: {meta.author}</li>
  </ul>
</div>

<style>
</style>
