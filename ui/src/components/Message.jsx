const Message = (props) => {
  const { messageData: {nickname, message } } = props
  return <li>{`${nickname}: ${message}`}</li>
}

export default Message
