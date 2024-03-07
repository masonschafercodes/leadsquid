<script lang="ts">
  let keywordInput = '';
  import { addKeyword, keywords } from '../stores/keywords';

  const sendKeywords = async () => {
    const response = await fetch('http://localhost:3000/api/queue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        keywords: $keywords
      })
    });
    const data = await response.json();
    console.log(data);
  };
</script>

<main>
  <h1>Send Keywords to the Server</h1>
  <form on:submit|preventDefault={() => addKeyword(keywordInput)}>
    <label for="new-keyword">New Keyword</label>
    <input type="text" id="new-keyword" name="new-keyword" bind:value={keywordInput} />
    <button type="submit">Add</button>
  </form>

  <h1>Keywords</h1>
  {#each $keywords as keyword}
    <p>{keyword}</p>
  {/each}

  <button on:click={() => keywords.set([])}>Clear</button>
  <button on:click={sendKeywords}>Send list to Server</button>
</main>
