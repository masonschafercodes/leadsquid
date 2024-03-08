<script lang="ts">
  import { onMount } from 'svelte';
  import { addKeyword, keywords, removeKeyword } from '../stores/keywords';
  import { addJob, checkJobStatus, jobs } from '../stores/jobs';
  import Sun from 'svelte-radix/Sun.svelte';
  import Moon from 'svelte-radix/Moon.svelte';
  import Button from '@/components/ui/button/button.svelte';
  import { toggleMode } from 'mode-watcher';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Card from '$lib/components/ui/card';
  import { buttonVariants } from '@/components/ui/button';
  import { Label } from '@/components/ui/label';
  import { Input } from '@/components/ui/input';
  import { currentYScroll } from '../stores/yScroll';

  let keywordInput = '';
  let errorMessage = '';
  let keywordInputRef: HTMLInputElement;

  const handleAddKeyword = () => {
    addKeyword(keywordInput);
    keywordInput = '';
  };

  const sendKeywords = async () => {
    const response = await fetch('http://localhost:3001/api/queue', {
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
      keywords.set([]);
      keywordInputRef.blur();
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

  $: console.log($currentYScroll);
</script>

<main
  class="font-geist flex h-full w-full flex-col items-center justify-start overflow-x-hidden"
  on:scroll={(e) => currentYScroll.set(e.currentTarget.scrollTop)}
>
  <header
    class="fixed z-10 flex w-full items-center justify-center p-4 {$currentYScroll > 0 &&
      'border-b border-slate-300 bg-slate-300/10 backdrop-blur-lg dark:border-slate-900 dark:bg-slate-900/10'}"
  >
    <div class="flex w-full max-w-6xl items-center justify-between">
      <h1 class="text-xl font-bold">LeadSquid</h1>
      <div class="flex items-center justify-center gap-2">
        <Dialog.Root>
          <Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Create New Search</Dialog.Trigger>
          <Dialog.Content class="sm:max-w-[425px]">
            <Dialog.Header>
              <Dialog.Title>Create an new Search</Dialog.Title>
              <Dialog.Description>
                Create a new lead search from keywords. You can add multiple keywords at once.
              </Dialog.Description>
            </Dialog.Header>
            <div class="flex flex-col gap-2">
              <Label for="name">Name</Label>
              <Input id="name" value="Pedro Duarte" class="col-span-3" />
            </div>
          </Dialog.Content>
        </Dialog.Root>
        <Button on:click={toggleMode} variant="outline" size="icon">
          <Sun class="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon class="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span class="sr-only">Toggle theme</span>
        </Button>
      </div>
    </div>
  </header>
  <div class="mt-24 flex w-full max-w-6xl flex-col gap-6">
    <Card.Root>
      <Card.Header>
        <Card.Title>Developer, SAAS, Backend Dev, CEO</Card.Title>
        <Card.Description>This data will be ready soon!</Card.Description>
      </Card.Header>
      <Card.Footer class="flex justify-end">
        <Button variant="outline">View Data</Button>
      </Card.Footer>
    </Card.Root>
    <Card.Root>
      <Card.Header>
        <Card.Title>Developer, SAAS, Backend Dev, CEO</Card.Title>
        <Card.Description>This data will be ready soon!</Card.Description>
      </Card.Header>
      <Card.Footer class="flex justify-end">
        <Button variant="outline">View Data</Button>
      </Card.Footer>
    </Card.Root>
    <Card.Root>
      <Card.Header>
        <Card.Title>Developer, SAAS, Backend Dev, CEO</Card.Title>
        <Card.Description>This data will be ready soon!</Card.Description>
      </Card.Header>
      <Card.Footer class="flex justify-end">
        <Button variant="outline">View Data</Button>
      </Card.Footer>
    </Card.Root>
    <Card.Root>
      <Card.Header>
        <Card.Title>Developer, SAAS, Backend Dev, CEO</Card.Title>
        <Card.Description>This data will be ready soon!</Card.Description>
      </Card.Header>
      <Card.Footer class="flex justify-end">
        <Button variant="outline">View Data</Button>
      </Card.Footer>
    </Card.Root>
    <Card.Root>
      <Card.Header>
        <Card.Title>Developer, SAAS, Backend Dev, CEO</Card.Title>
        <Card.Description>This data will be ready soon!</Card.Description>
      </Card.Header>
      <Card.Footer class="flex justify-end">
        <Button variant="outline">View Data</Button>
      </Card.Footer>
    </Card.Root>
    <Card.Root>
      <Card.Header>
        <Card.Title>Developer, SAAS, Backend Dev, CEO</Card.Title>
        <Card.Description>This data will be ready soon!</Card.Description>
      </Card.Header>
      <Card.Footer class="flex justify-end">
        <Button variant="outline">View Data</Button>
      </Card.Footer>
    </Card.Root>
    <Card.Root>
      <Card.Header>
        <Card.Title>Developer, SAAS, Backend Dev, CEO</Card.Title>
        <Card.Description>This data will be ready soon!</Card.Description>
      </Card.Header>
      <Card.Footer class="flex justify-end">
        <Button variant="outline">View Data</Button>
      </Card.Footer>
    </Card.Root>
    <Card.Root>
      <Card.Header>
        <Card.Title>Developer, SAAS, Backend Dev, CEO</Card.Title>
        <Card.Description>This data will be ready soon!</Card.Description>
      </Card.Header>
      <Card.Footer class="flex justify-end">
        <Button variant="outline">View Data</Button>
      </Card.Footer>
    </Card.Root>
  </div>
</main>
