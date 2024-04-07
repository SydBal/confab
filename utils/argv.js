/**
 * argv
 * utility for getting and parsing command line arguments
 * 
 * from: https://stackoverflow.com/a/69409483
 * 
 * Output:
 * If invoked with node app.js then argv('foo') will return null
 * If invoked with node app.js --foo then argv('foo') will return true
 * If invoked with node app.js --foo= then argv('foo') will return ''
 * If invoked with node app.js --foo=bar then argv('foo') will return 'bar'} key
 */
const argv = key => {
  // Return true if the key exists and a value is defined
  if (process.argv.includes( `--${ key }`)) return true;

  const value = process.argv.find(element => element.startsWith( `--${ key }=`));

  // Return null if the key does not exist and a value is not defined
  if (!value) return null;
  
  return value.replace(`--${ key }=`, '');
}

/**
 * Helper functions for handling our known arguments
 * 
 * using process.env.VITE_*  for setting values that will be used in UI
 */

// uiPort for vite server
const uiPortArg = parseInt(argv('ui-port'))
export const uiPort = process.env.PORT || uiPortArg || 1337
process.env.VITE_UI_PORT = uiPort

// socketPort for socketio server
const socketPortArg = parseInt(argv('socket-port'))
export const socketPort = socketPortArg || uiPort + 1
process.env.VITE_SOCKET_PORT = socketPort

// isDev for dev server
export const isDev = argv('dev')

export default argv