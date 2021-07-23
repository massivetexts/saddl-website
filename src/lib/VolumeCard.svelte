<script>
  export let meta;
  const encode = (str) => encodeURIComponent(str.replaceAll("/", "===="));
</script>

<div class="four columns">
  <p>
    <strong>
      <a href="/relationships/{encode(meta.htid)}/"> {meta.title} ({meta.rights_date_used})</a>
    </strong>
  </p>
  <ul>
    <li>Description:{meta.description}</li>
    <li>Author: {meta.author}</li>
  </ul>
</div>

<style>
</style>
