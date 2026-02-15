import { getUserAuthData, IUser } from '@/entities/User'
import { chatActions } from '@/features/Chat'
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

const generateRoomId = (senderId: string, recipientId: string) => {
  return [senderId, recipientId].sort().join('_')
}

export const useChatSocket = (recipientId: string) => {
  const user: IUser | undefined = useSelector(getUserAuthData)
  const dispatch = useDispatch()
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!recipientId || !user?.user.id) return

    const socket = new WebSocket(import.meta.env.VITE_WS_URL)
    socketRef.current = socket

    const senderId = user.user.id
    const roomId = generateRoomId(senderId, recipientId)

    socket.onopen = () => {
      console.log('[WebSocket] Подключено')

      socket.send(
        JSON.stringify({
          type: 'join',
          roomId,
          senderId,
          recipientId
        })
      )
    }

    socket.onmessage = event => {
      try {
        const data = JSON.parse(event.data)
        console.log('[WebSocket] Получено сообщение:', data)

        if (data.type === 'message') {
          dispatch(chatActions.addMessage(data.message))
        }
      } catch (err) {
        console.error('[WebSocket] Ошибка парсинга:', err)
      }
    }

    socket.onerror = error => {
      console.error('[WebSocket] Ошибка:', error)
    }

    socket.onclose = () => {
      console.log('[WebSocket] Соединение закрыто')
    }

    return () => {
      console.log('[WebSocket] Отключение')
      socket.close()
    }
  }, [dispatch, recipientId, user?.user.id])

  const sendMessage = (content: string) => {
    if (!recipientId || !user?.user.id) return

    const socket = socketRef.current

    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: 'message',
          roomId: generateRoomId(user?.user.id, recipientId),
          senderId: user?.user.id,
          recipientId,
          content
        })
      )
    } else {
      console.warn('[WebSocket] Соединение не готово')
    }
  }

  return { sendMessage }
}
