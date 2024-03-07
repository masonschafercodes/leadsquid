<script lang="ts">
  import { onMount } from 'svelte';
  import { addKeyword, keywords } from '../stores/keywords';
  import { addJob, checkJobStatus, jobs } from '../stores/jobs';

  let keywordInput = '';

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
    if (data.status === 'ok') {
      addJob(data.job_id, 'pending');
    }
  };

  onMount(() => {
    // every 10 seconds
    const interval = setInterval(() => {
      $jobs.forEach(async (job) => {
        try {
          await checkJobStatus(job.jobId);
        } catch (error) {
          console.error(error);
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  });
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

  <h1>Jobs</h1>
  {#each $jobs as job}
    <p>{job.jobId} - {job.status}</p>
  {/each}
</main>
