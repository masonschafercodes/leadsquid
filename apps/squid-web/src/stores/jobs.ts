import { get, writable } from 'svelte/store';

export const jobs = writable<{ jobId: number; status: string }[]>([]);

export const addJob = (jobId: number, status: string) => {
  jobs.update((jobs) => [...jobs, { jobId, status }]);
};

export const getStoredJobStatus = (jobId: number) => {
  const job = get(jobs).find((job) => job.jobId === jobId);
  return job;
};

export const checkJobStatus = async (jobId: number) => {
  const job = getStoredJobStatus(jobId);
  if (!job || job.status === 'completed' || job.status === 'failed') {
    return;
  }

  console.log('[LOG] Checking Job Status for: ', jobId);
  const response = await fetch(`http://localhost:3001/api/queue/${job.jobId}`);

  const data = await response.json();

  if (data.status === 'error') {
    return console.error(data.message);
  }

  if (data.status !== job.status) {
    jobs.update((jobs) =>
      jobs.map((j) => {
        if (j.jobId === jobId) {
          return { ...j, status: data.status };
        }
        return j;
      })
    );
  }
};
