<script>
  let search_query = "";

  function searchSubmit() {
    // is there a better way to handle this? Probably!
    window.location.href = `/search/${search_query}`;
  }
</script>

<form class="search" on:submit|preventDefault={searchSubmit}>
  <input bind:value={search_query} />
  <button type="submit"> Search </button>
</form>

<style>
  form.search {
    text-align: right;
  }
  form.search button {
    padding: 3px;
    margin: 2px;
    line-height: inherit;
    height: auto;
  }
  form.search input {
    margin-top: 0.5rem;
  }
</style>
