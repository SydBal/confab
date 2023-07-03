# confab

## Setup
### Install dependancies
```yarn```

### Development server
Powered by [Vite](https://vitejs.dev/), including HMR
```yarn dev```

Webpage hosted at https://localhost:1337/

Socket server hosted at https://localhost:1338/

### Production server
Not including HMR
```yarn start```

### Docker
Build image

```docker build -t confab .```

Run in container

```docker run -p 1337:1337 -p 1338:1338 confab```

## Command Line Arguments
Functionality defined in `/utils/argv.js`
### ui-port
Port that vite will serve the ui assets to

Usage: `yarn dev --ui-port=4242`

Result: Site available at https://localhost:4242/

### socket-port
Port that Socket.io will service sockets on

> NOTE: default value will be (ui-port + 1)
>
> ex: ui-port === 1337 :: socket-port === 1338

Usage: `yarn dev --socket-port=4242`

Result: Site available at https://localhost:1337/, automatically pointed to sockets on port `4242`