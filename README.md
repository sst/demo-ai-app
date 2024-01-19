# ❍ Movies Demo

A sample movies app built with [❍ Ion](https://github.com/sst/ion) to demo how to **use AI in your apps using your data** — [movies.sst.dev](https://movies.sst.dev)

![Movies App](screenshot.png)

The movie database in this app contains around 700 popular movies. You can search through them, check out related movies, and some of the movies are also tagged.

## About

Most of the AI demos to date include some form of chat. While this is useful, it doesn't apply to majority of the apps out there. It also involves storing your data outside your infrastructure.

This demo shows how you can use AI related features in your infrastructure in a way that makes sense to your users.

## AI

The following AI features are powered by our new Vector component.

1. **Tags** — Classify data based on text that's more descriptive and carries more context
2. **Related** — Find semantically similar data in your database
3. **Search** — Deep search your data and images using natural language
4. **Search Images** — Do a deep search through your data, including your images

### Vector Component

The Vector component is based on Amazon Bedrock and it exposes a couple of functions that makes it easy to use AI with your data.

- `ingest`: This takes some text, generates an embedding with a given model, and stores it in a Vector database powered by RDS. Also takes some metadata to tag the data.
- `retrieve`: Takes a prompt and optionally the metadata to filter on. Returns matching results with a score 0 - 1.

### Models

Currently the embeddings can be generated using the `titan-embed-text-v1`, `titan-embed-image-v1`, and `text-embedding-ada-002`.

### Ion

[❍ Ion](https://github.com/sst/ion) is an experimental new engine for [SST](https://sst.dev) that has some unique advantages over our previous CDK based engine. Here are a couple that you can see in action in this repo:

1. It's a lot faster to deploy, 10x faster
2. There are [no stacks](sst.config.ts#L15) or stack limits
3. No cyclical dependency issues in your resources
4. Access linked resources in Next.js doesn't need top-level await
5. Next.js 14 with linked resources are deployed in order and don't need a _double deploy_
6. Next.js apps have access to linked resources without the need for [`sst bind next build`](package.json#L7)

## How it Works

This demo works by ingesting movie data from IMDB, generating embeddings, and storing it in a Vector database. The Next.js app then retrieves the data from the Vector database.

The sample app is made up of **4 simple components** defined in the [`sst.config.ts`](sst.config.ts):

1. A DynamoDB table to store the movies
2. An S3 bucket to store the posters
3. A Vector database to store the embeddings
4. A Next.js app

---

Join the SST community over on [Discord](https://discord.gg/sst) and follow us on [Twitter](https://twitter.com/SST_dev).
