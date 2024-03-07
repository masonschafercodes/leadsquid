<script lang="ts">
  import { onMount } from 'svelte';
  import { addKeyword, keywords, removeKeyword } from '../stores/keywords';
  import { addJob, checkJobStatus, jobs } from '../stores/jobs';

  let keywordInput = '';
  let errorMessage = '';

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
      errorMessage = '';
      return addJob(data.job_id, 'pending');
    }

    errorMessage = data.message;
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

<main class="flex h-full w-full flex-col items-center justify-center gap-6 bg-neutral-900">
  <h1 class="text-4xl font-semibold text-neutral-100">LeadSquid</h1>
  <form on:submit|preventDefault={() => addKeyword(keywordInput)} class="flex w-full max-w-sm flex-col gap-2">
    <div class="flex flex-col gap-1">
      <label for="new-keyword" class="font-medium text-neutral-100">New Keyword</label>
      <input
        type="text"
        id="new-keyword"
        name="new-keyword"
        bind:value={keywordInput}
        class="rounded-md border border-neutral-700 bg-neutral-800 p-2 text-neutral-100 shadow-md"
      />
    </div>
    <button
      type="submit"
      class="rounded-md border border-neutral-700 bg-neutral-800 p-2 text-neutral-100 shadow-md transition-all hover:bg-neutral-800/90"
      >Add</button
    >
    <div class="grid grid-cols-3 gap-2">
      {#each $keywords as keyword}
        <button
          type="button"
          on:click={() => removeKeyword(keyword)}
          class="w-full overflow-hidden rounded-sm bg-green-300/90 px-1 py-0.5 text-center text-sm font-semibold text-green-800 shadow-sm hover:bg-red-300/90 hover:text-red-800"
        >
          {keyword}
        </button>
      {/each}
    </div>
  </form>

  <div class="flex w-full max-w-sm flex-col gap-2">
    <button
      on:click={sendKeywords}
      class=" rounded-md border border-neutral-700 bg-neutral-800 p-2 text-neutral-100 shadow-md transition-all hover:bg-neutral-800/90"
      >Send list to Server</button
    >
    {#if errorMessage !== ''}
      <p class="w-full rounded-md border border-red-800 bg-red-300/90 p-2 text-red-800 shadow-md">{errorMessage}</p>
    {/if}
  </div>

  <div
    class="flex h-[25%] w-full max-w-sm flex-col gap-1 overflow-y-auto rounded-md border border-neutral-700 bg-neutral-800 p-2 shadow-md"
  >
    {#each $jobs as job}
      <p class="text-sm font-medium text-neutral-100">{job.jobId} - {job.status}</p>
    {/each}
  </div>
</main>
