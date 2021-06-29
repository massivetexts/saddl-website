<script context="module">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch }) {
		const url = `/catalog/${page.params.htid}.json`;
		try {
			const res = await fetch(url);
			const d = await res.json()
			const dat = d
			return {
				props: {
					lookup_list: dat
				}
			};
		} catch {
			return {
//				status: res.status,
				error: new Error(`Could not load ${url}`)
			};
		}
	}

</script>

<script>

export let lookup_list;

</script>

<h1>

</h1>

{#await lookup_list}
	Waiting
{:then hathifiles_info}
	<details>
	<summary>{hathifiles_info.author}, {hathifiles_info.title}</summary>

	<dl>
		{#each Object.keys(hathifiles_info) as k}
			<dt>{k}</dt>
			<dd>{hathifiles_info[k]}</dd>
		{/each}
	</dl>
	</details>
{/await}
