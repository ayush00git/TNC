import { useState } from 'react'
import { FiSend } from 'react-icons/fi'
import AttachmentMenu from './AttachmentMenu'

type Message = {
  id: number
  sender: 'me' | 'them'
  text: string
  time: string
}

type Chat = {
  id: number
  name: string
  lastMessage: string
  lastTime: string
  unread: number
  messages: Message[]
}

const initialChats: Chat[] = [
  {
    id: 1,
    name: 'tnc-backend',
    lastMessage: 'Pushed latest auth fixes.',
    lastTime: '09:24',
    unread: 2,
    messages: [
      {
        id: 1,
        sender: 'them',
        text: 'Can you review the new auth flow?',
        time: '09:20',
      },
      {
        id: 2,
        sender: 'me',
        text: 'Yep, on it now.',
        time: '09:22',
      },
      {
        id: 3,
        sender: 'them',
        text: 'Pushed latest auth fixes.',
        time: '09:24',
      },
    ],
  },
  {
    id: 2,
    name: 'design-system',
    lastMessage: 'Dark mode tokens look great.',
    lastTime: 'Yesterday',
    unread: 0,
    messages: [
      {
        id: 1,
        sender: 'me',
        text: 'Let’s keep the palette close to GitHub’s dark theme.',
        time: '21:10',
      },
      {
        id: 2,
        sender: 'them',
        text: 'Dark mode tokens look great.',
        time: '21:13',
      },
    ],
  },
]

function ChatApp() {
  const [chats, setChats] = useState<Chat[]>(initialChats)
  const [activeChatId, setActiveChatId] = useState<number>(initialChats[0]?.id ?? 1)
  const [input, setInput] = useState('')

  const activeChat = chats.find((c) => c.id === activeChatId) ?? chats[0]

  const handleSend = () => {
    if (!input.trim() || !activeChat) return

    const now = new Date()
    const time = now.toTimeString().slice(0, 5)

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              lastMessage: input.trim(),
              lastTime: time,
              messages: [
                ...chat.messages,
                {
                  id: chat.messages.length + 1,
                  sender: 'me',
                  text: input.trim(),
                  time,
                },
              ],
            }
          : chat,
      ),
    )

    setInput('')
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-screen w-screen bg-[#010409] text-[#e6edf3] noise-bg">
      <div className="flex h-full w-full bg-[#02040a]/95 backdrop-blur-sm">
        {/* Sidebar */}
        <aside className="hidden border-r border-[#21262d] bg-[#050814] sm:flex sm:w-72 sm:flex-col">
          <div className="flex items-center gap-2 border-b border-[#30363d] px-4 py-3">
            <div className="h-6 w-6 rounded bg-emerald-500/15 ring-1 ring-emerald-500/60" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[#e6edf3]">tnc-chat</span>
              <span className="text-xs text-[#8b949e]">Conversations</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => {
              const isActive = chat.id === activeChat?.id
              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => setActiveChatId(chat.id)}
                  className={`flex w-full flex-col gap-1 border-b border-[#21262d] px-4 py-3 text-left transition-colors hover:bg-[#161b22] ${
                    isActive ? 'bg-[#161b22]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-[#e6edf3]">
                      {chat.name}
                    </span>
                    <span className="whitespace-nowrap text-xs text-[#8b949e]">
                      {chat.lastTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-[#8b949e]">
                      {chat.lastMessage}
                    </span>
                    {chat.unread > 0 && (
                      <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#238636] px-1 text-[10px] font-semibold text-white">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Main chat area */}
        <main className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-[#21262d] bg-[#050814] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#161b22] text-sm font-semibold text-[#e6edf3]">
                {activeChat?.name
                  .split(' ')
                  .map((word) => word[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#e6edf3]">
                  {activeChat?.name ?? 'Select a chat'}
                </span>
                <span className="text-xs text-[#8b949e]">Online • End-to-end encrypted</span>
              </div>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-[#010409] px-3 py-3 sm:px-6 sm:py-4">
            <div className="mx-auto flex h-full max-w-3xl flex-col gap-2 sm:gap-3">
              {activeChat?.messages.map((message) => {
                const isMe = message.sender === 'me'
                return (
                  <div
                    key={message.id}
                    className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`message-bubble max-w-[75%] rounded-3xl px-3 py-2 text-xs sm:max-w-[70%] sm:px-4 sm:py-2 sm:text-sm shadow-sm ${
                        isMe
                          ? 'rounded-br-xl bg-[#1f883d] text-white shadow-[0_0_0_1px_#2ea04380]'
                          : 'rounded-bl-xl bg-[#11151c] text-[#e6edf3] shadow-[0_0_0_1px_#30363d80]'
                      }`}
                    >
                      <p className="whitespace-pre-wrap wrap-break-word">{message.text}</p>
                      <div
                        className={`mt-1 flex items-center gap-1 text-[10px] ${
                          isMe ? 'text-emerald-100/80' : 'text-[#8b949e]'
                        }`}
                      >
                        <span>{message.time}</span>
                        {isMe && <span>✓✓</span>}
                      </div>
                    </div>
                  </div>
                )
              })}

              {!activeChat && (
                <div className="flex h-full items-center justify-center text-sm text-[#8b949e]">
                  Select a chat from the left to start messaging.
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <div className="border-t-0 bg-transparent px-3 pb-4 pt-0 sm:px-4 sm:pb-6">
            <div className="mx-auto flex max-w-3xl items-center gap-2 sm:gap-3">
              <AttachmentMenu />
              <div className="flex flex-1 items-center gap-2 rounded-full border border-[#30363d] bg-[#020711] px-3 py-1.5 shadow-[0_14px_45px_rgba(0,0,0,0.75)] sm:px-4">
                <input
                  type="text"
                  className="h-8 flex-1 bg-transparent text-xs text-[#e6edf3] outline-none sm:h-9 sm:text-sm"
                  placeholder="Type a message like you would on WhatsApp..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button
                type="button"
                onClick={handleSend}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#2ea043] bg-[#238636] text-xs font-medium text-white shadow-sm shadow-emerald-500/20 transition hover:bg-[#2ea043] active:translate-y-px sm:h-10 sm:w-10 disabled:cursor-not-allowed disabled:border-[#23863666] disabled:bg-[#23863666]"
                disabled={!input.trim()}
              >
                <FiSend className="text-[15px]" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ChatApp


