<script context="module">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch }) {
		const url = `/relationships/random.json`;
		const res = await fetch(url);
    try {
      const dat = res.json()
      return {
        props: {
          my_ids: dat
        }
      };
    } catch {
      return {
        status: res.status,
        error: new Error(`Could not load ${url}`)
      };
    }
	}

</script>

<script>

export let my_ids;

</script>

<h1>Random Relationships</h1>

For now, I'm just fetching a bunch of random HTIDs.

{#await my_ids}
	Waiting
{:then id_list}
	{#each id_list as id}
    <a href="/relationships/{id.htid}/">    
      {id.title} - {id.author}
    </a>
    {/each}
{/await}
