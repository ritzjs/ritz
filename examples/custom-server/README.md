# custom-server

## Development

1. Install
   ```sh
   yarn
   ```
2. Migrate
   ```sh
   ritz prisma migrate dev
   ```
3. Start the dev server

```sh
ritz dev

// Or if you want hot-reloading of server.js, use:
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production

```sh
ritz build
ritz start
```
