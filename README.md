# nekot

Generate JWT for a user with the given user ID.

A *demo* instance available on [nekot.alexesprit.com](https://nekot.alexesprit.com/).

**Important note**: Only use this application locally, otherwise everyone will be able to generate JWTs for your service with it.

## Development

```sh
# Install dependencies
> yarn install

# Copy and fill example env file
> cp .env.example .env
> nano .env

# Run application
> yarn start

# Run dev server with hot reload
> yarn start:dev

# Format project files
> yarn format

# Check formatting
> yarn format:check
```

## License

Licensed under the [MIT License](LICENSE).
