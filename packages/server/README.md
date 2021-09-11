# `@ritzjs/server`

Responsible for managing the development and production server for Ritz.

The Server package exposes some key functions for controlling ritz.

## `dev()`

Start the development server in watch mode.

```ts
import {dev} from "@ritzjs/server"

await dev(serverConfig)
```

## `prod()`

Start the production server.

```ts
import {prod} from "@ritzjs/server"

await prod(serverConfig)
```

_This readme needs more work. If you want to help out please submit a PR_
