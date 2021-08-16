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
        SaDDL provides content-based relationship tags for millions of books, include different editions and printings
        of identical works, different volumes of multi-part sets, and whole/part relationships where works are found
        within larger anthologies. We also provide recommendations for similar books.
      </p>
      <p>
        This website allows you to browse and search the SaDDL data. It is an initial release, and book relationships
        <em>may</em> change as we evaluate and update the results. Full data is available for
        <a href="https://github.com/massivetexts/saddl-dataset">download</a>.
      </p>
      <ul>
        Explore example works:
        <li>
          <a href="relationships/work/30331">SADDL-W30331</a>: Four printings of "The writings of Henry David Thoreau."
          (v.6) by
          <em>Henry David Thoreau.</em>
        </li>
        <li>
          <a href="relationships/man/4202"> SADDL-M4202</a>: Four duplicates of "Heart's desire, the story of a
          contented town, certain peculiar citizens and two fortunate lovers" by
          <em>by Emerson Hough</em>.
        </li>
        <li>
          <a href="relationships/work/27683">SADDL-W27683</a>: Seventeen printings of "Leaves of Grass" by
          <em>Walt Whitman</em>.
        </li>
      </ul>
      <p>
        SaDDL is from the <a href="http://portfolio.du.edu/massivetexts">Massive Texts Lab</a> at the University of
        Denver, and was led by Peter Organisciak, Benjamin M. Schmidt, and Krystyna Matusiak. It is trained on
        <a href="https://www.hathitrust.org">HathiTrust Digital Library</a> books provided by the
        <a href="https://analytics.hathitrust.org">HTRC</a>.
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
