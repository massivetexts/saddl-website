<script>
  import Header from "$lib/Header/index.svelte";
  import "../normalize.css";
  import "../skeleton.css";
  import "../app.css";
</script>

<Header />

<main>
  <slot />
</main>

<footer>
  <p>SaDDL is funded by <a href="https://www.imls.gov/grants/awarded/lg-86-18-0061-18-0">IMLS #LG-86-18-0061-18.</a></p>
</footer>

<style>
  footer {
    padding-top: 10px;
    border-top: 1px solid #eee;
  }
</style>
