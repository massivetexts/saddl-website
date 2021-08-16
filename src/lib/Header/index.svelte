<script>
  import { page } from "$app/stores";
  import SearchBar from "$lib/SearchBar.svelte";
</script>

<header>
  <div class="corner">
    <span class="bighead"><a href="/">SaDDL</a></span>
    <span class="subhead">Similarities and Duplicates in Digital Libraries</span>
  </div>

  <nav class="navbar">
    <ul class="navbar-list">
      <li class="navbar-item" class:active={$page.path === "/relationships/htid"}>
        <a class="navbar-link" sveltekit:prefetch href="/relationships/htid">Volumes</a>
      </li>
      <li class="navbar-item" class:active={$page.path === "/relationships/work"}>
        <a class="navbar-link" sveltekit:prefetch href="/relationships/work">Work</a>
      </li>
      <li class="navbar-item" class:active={$page.path === "/relationships/man"}>
        <a class="navbar-link" sveltekit:prefetch href="/relationships/man">Manifestation</a>
      </li>
      <!--TODO #4 Add About page -->
    </ul>
    <SearchBar />
  </nav>
</header>

<style>
  .corner {
    letter-spacing: 0.3rem;
  }
  .subhead {
    margin-left: 10px;
    color: #777;
    font-size: 15px;
  }

  .bighead a {
    text-decoration: none;
    color: black;
  }
  .bighead {
    font-size: 20px;
    text-shadow: -1px -1px;
    text-transform: uppercase;
    font-weight: 500;
  }
  .navbar {
    display: block;
    width: 100%;
    height: 3.5rem;
    background: #fff;
    z-index: 99;
    margin-bottom: 10px;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
  .navbar-list {
    list-style: none;
    margin-bottom: 0;
  }
  .navbar-item {
    position: relative;
    float: left;
    margin-bottom: 0;
  }
  .navbar-link {
    /*text-transform: uppercase;*/
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2rem;
    margin-right: 35px;
    text-decoration: none;
    line-height: 3.5rem;
    color: #222;
  }
  .navbar-link:hover {
    text-shadow: 1px 1px grey;
  }
</style>
