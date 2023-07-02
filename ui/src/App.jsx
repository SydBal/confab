import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import socketioLogo from './assets/socketio.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { socket } from './socket';

function App() {
  const [formMessage, setFormMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true)
    }

    const onDisconnect = () => {
      setIsConnected(false)
    }

    const onChatMessage = (message) => {
      setMessages(messages => [message, ...messages])
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('chat message', onChatMessage)

    socket.connect()

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('chat message')
    }
  }, [])

  const handleInputChange = (event) => {
    setFormMessage(event.target.value);
  }


  const handleFormSubmit = (event) => {
    socket.emit('chat message', formMessage);
    setFormMessage('')
    event.preventDefault();
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://socket.io/" target="_blank">
          <img src={socketioLogo} className="logo socketio" alt="Socket.io logo" />
        </a>
      </div>
      <h1>Vite + React + Socket.io</h1>
      { isConnected &&
        <>
          <form id="form" action="" onSubmit={handleFormSubmit}>
            <input
              id="chat-input"
              autoComplete="off"
              placeholder='Chat.'
              value={formMessage}
              onChange={handleInputChange}
            />
            <button disabled={formMessage.length === 0}>Send</button>
          </form>
          <ul id="messages">
            {
              messages.map((message, i) => <li key={i}>{message}</li>)
            }
          </ul>
        </>
      }
      { !isConnected && 'Socket.io is not connected...' }
    </>
  )
}

export default App
