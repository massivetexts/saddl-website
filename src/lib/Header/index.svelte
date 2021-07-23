<script>
  import { page } from "$app/stores";
</script>

<header>
  <div class="corner">
    <span class="bighead"><a href="/">SaDDL</a></span>
    <span class="subhead">Similarities and Duplicates in Digital Libraries</span>
  </div>

  <nav class="navbar">
    <ul class="navbar-list">
      <li class="navbar-item" class:active={$page.path === "/catalog"}>
        <a class="navbar-link" sveltekit:prefetch href="/catalog">Catalog</a>
      </li>
      <li class="navbar-item" class:active={$page.path === "/relationships"}>
        <a class="navbar-link" sveltekit:prefetch href="/relationships">Relationships</a>
      </li>
      <!--TODO #1 Add Work page-->
      <li class="navbar-item" class:active={$page.path === "/work"}>
        <a class="navbar-link" sveltekit:prefetch href="/work">Work</a>
      </li>
      <!--TODO #2 Add manifestation page-->
      <li class="navbar-item" class:active={$page.path === "/manifestation"}>
        <a class="navbar-link" sveltekit:prefetch href="/manifestation">Manifestation</a>
      </li>
      <!--TODO #4 Add About page -->
    </ul>
  </nav>

  <div class="corner">
    <!-- TODO #3 Add search box -->
  </div>
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
