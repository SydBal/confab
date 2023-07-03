import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import socketioLogo from './assets/socketio.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { socket } from './socket';
import Message from './Message'

function App() {
  const [nickname, setNickname] = useState('')
  const [nicknameInput, setNicknameInput] = useState('')
  const [chatMessage, setChatMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true)
      setNickname(socket.id)
    }

    const onDisconnect = () => {
      setIsConnected(false)
    }

    const onChatMessage = (message) => {
      setMessages(messages => [message, ...messages])
    }

    const onMessageMemory = (oldMessagesData) => {
      setMessages(messages => [...messages, ...oldMessagesData.slice().reverse()])
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('chat message', onChatMessage)
    socket.on('message memory', onMessageMemory)

    socket.connect()

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('chat message', onChatMessage)
      socket.off('message memory', onMessageMemory)
    }
  }, [])

  const handleChatInputChange = (event) => {
    setChatMessage(event.target.value);
  }


  const handleChatSubmit = (event) => {
    socket.emit('chat message', chatMessage);
    setChatMessage('')
    event.preventDefault()
  }

  const handleNicknameInputChange = (event) => {
    setNicknameInput(event.target.value);
  }


  const handleNicknameSubmit = (event) => {
    socket.emit('nickname update', nicknameInput);
    setNickname(nicknameInput)
    setNicknameInput('')
    event.preventDefault()
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
          <form id="nicknameForm" action="" onSubmit={handleNicknameSubmit}>
            <input
              id="nickname-input"
              autoComplete="off"
              placeholder={nickname}
              value={nicknameInput}
              onChange={handleNicknameInputChange}
            />
            <button disabled={nicknameInput?.length === 0 || nicknameInput === nickname}>Update Name</button>
          </form>
          <form id="chatForm" action="" onSubmit={handleChatSubmit}>
            <input
              id="chat-input"
              autoComplete="off"
              placeholder={`Chat as ${nickname}`}
              value={chatMessage}
              onChange={handleChatInputChange}
            />
            <button disabled={chatMessage?.length === 0}>Send</button>
          </form>
          <ul id="messages">
            {
              messages.map((messageData, i) => <Message key={i} messageData={messageData} />)
            }
          </ul>
        </>
      }
      { !isConnected && 'Socket.io is not connected...' }
    </>
  )
}

export default App
