# Havana House Monorepo

This repository contains the code for the Havana House application, including the **server**, **admin**, and **client** projects. Each project relies on environment variables defined in a `.env` file.

## Environment setup

1. Copy the example environment files provided for each project:

```bash
cp server/.env.example server/.env
cp admin/.env.example admin/.env
cp client/.env.example client/.env
```

2. Edit the newly created `.env` files and replace the placeholder values with your real credentials.

The actual `.env` files are ignored by Git so your secrets remain private.

## Optional: removing old secrets

If secrets were previously committed, consider rewriting history with a tool such as [`git filter-repo`](https://github.com/newren/git-filter-repo) to permanently remove them from the repository history.
