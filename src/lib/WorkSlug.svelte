<script>
  export let metadata;
  const encode = (str) => encodeURIComponent(str.replaceAll("/", "===="));
</script>

<div class="overall">
  <span class=title>{metadata.title}</span>
  <span class=author>{metadata.author}</span>
  ({metadata.rights_date_used})
  <a href="/relationships/{encode(metadata.htid)}">relationships</a>
</div>

<style>

  .title {
    font-style: "bold"
  }

  .overall {
    width: 13rem;
    margin: 4px;
    background-color: rgb(212, 206, 206);
  }
</style>