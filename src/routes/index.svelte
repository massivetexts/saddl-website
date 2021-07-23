<script context="module">
  export const prerender = true;
</script>

<script>
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<section class="header">
  <div class="row">
    <div class="twelve columns">
      <h2 class="title">
        <div class="welcome">Similarities and Duplicates in Digital Libraries</div>
      </h2>
    </div>
  </div>
  <div class="row">
    <div class="twelve columns">
      <p>
        <!-- TODO #6 Intro to SaDDL copy -->
        SaDDL provides content-based relationship tags for millions of books, include different editions and printings of
        identical works, different volumes of multi-part sets, and whole/part relationships where works are found within
        larger anthologies. We also provide recommendations for similar books.
      </p>
    </div>
  </div>
</section>

<style>
  .title {
    margin-top: 25px;
    border-bottom: 10px #bbb;
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
</style>
