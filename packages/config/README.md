# `config`

> A centralized source for reading project configurations from `ritz.config.js`.

## Usage

```js
import {getConfig} from "@ritzjs/config"

const config = getConfig()

console.log(config._meta.packageName)
```
