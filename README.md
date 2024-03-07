# LeadSquid

> LeadSquid is going to be a simple MVP/Proof of concept for me to learn some new tech. It's a platform that allows you to queue search keywords and allow the platform to scrape the web and return the results to you. As per the name, we are more focused on encriching sales professionals with leads.

## Tech Stack (Currently)

- Main REST API server:
  - hono (<https://hono.dev/>). Tiny web framework for the REST API.
  - bullmq (<https://docs.bullmq.io/>). This is apart of what is used to queue jobs for scraping.
  - redis (<https://redis.io/>). This is used as the queue for bullmq.
- squid-web:
  - sveltekit (<https://kit.svelte.dev/>). Main framework used
  - tailwindcss (<https://tailwindcss.com/>). CSS framework for quick and easy design
