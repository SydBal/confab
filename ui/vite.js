import { fileURLToPath } from 'url'
import { createServer, preview, build } from 'vite'
import { isDev, uiPort } from '../utils/argv.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const configFile = __dirname + 'vite.config.js'

const createDevServer = async () => {
  const devServer = await createServer({ configFile })
  await devServer.listen()
  console.log(`Vite Developement Server Initialized, view @ http://localhost:${uiPort}/`)
  return devServer
}

const createProdServer = async () => {
  await build({ configFile })
  const prodServer = await preview({ configFile })
  console.log(`Vite Production Server Initialized, view @ http://localhost:${uiPort}/`)
  return prodServer
}

/**
 * initViteServer
 * Handles running the server which serves users the webpage
 */
export const initViteServer = async () => {
  const viteServer = isDev ? await createDevServer() : await createProdServer()
  // viteServer.printUrls()
  return viteServer
}