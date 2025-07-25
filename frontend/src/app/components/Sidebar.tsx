// 'use client';
// import { useEffect, useState } from 'react';
// import { fetchChats, createChat } from '../lib/api';
// type Chat = {
//   id: string;
//   title: string | null;
//   created_at: string;
// };

// export default function Sidebar({
//   currentChatId,
//   onSelectChat,
// }: {
//   currentChatId: string | null;
//   onSelectChat: (id: string) => void;
// }) {
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [loading, setLoading] = useState(false);

//   async function load() {
//     setLoading(true);
//     try {
//       const data = await fetchChats();
//       setChats(data);
//     } finally {
//       setLoading(false);
//     }
//   }
//   useEffect(() => {
//     load();
//   }, []);

//   async function handleNewChat() {
//     const newChat = await createChat();
//     setChats((prev) => [newChat, ...prev]);
//     onSelectChat(newChat.id);
//   }

//   return (
//     <div className="w-64 bg-gray-900 text-white flex flex-col">
//       <button
//         onClick={handleNewChat}
//         className="p-3 bg-green-600 hover:bg-green-500"
//       >
//         + New Chat
//       </button>

//       <div className="flex-1 overflow-y-auto">
//         {loading && (
//           <div className="p-3 text-sm text-gray-400">Loading...</div>
//         )}
//         {chats.map((chat) => (
//           <div
//             key={chat.id}
//             onClick={() => onSelectChat(chat.id)}
//             className={`p-3 cursor-pointer hover:bg-gray-700 ${
//               chat.id === currentChatId ? 'bg-gray-700' : ''
//             }`}
//           >
//           <div className="truncate">{chat.title || 'Untitled chat'}</div>
//           <div className="text-xs text-gray-400">
//             {new Date(chat.created_at).toLocaleString()}
//           </div>
//         </div>
//         ))}
//       </div>
//     </div>
//   );
// }
//----------------------------------------------------------------------------------
// 'use client';
// import { useEffect, useState } from 'react';
// import { fetchChats, createChat } from '../lib/api';

// type Chat = {
//   id: string;
//   title: string | null;
//   created_at: string;
// };

// export default function Sidebar({
//   currentChatId,
//   onSelectChat,
// }: {
//   currentChatId: string | null;
//   onSelectChat: (id: string) => void;
// }) {
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [loading, setLoading] = useState(false);

//   async function load() {
//     setLoading(true);
//     try {
//       const data = await fetchChats();
//       setChats(data);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   async function handleNewChat() {
//     const newChat = await createChat();
//     setChats((prev) => [newChat, ...prev]);
//     onSelectChat(newChat.id);
//   }

//   return (
//     <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-lg border-r border-gray-700">
//       {/* Header */}
//       <div className="p-4 border-b border-gray-700 text-lg font-semibold tracking-wide bg-gray-900 flex items-center justify-between">
//         <span className="text-green-400">💬 Chats</span>
//         <button
//           onClick={handleNewChat}
//           className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-500 transition-all duration-300"
//         >
//           + New
//         </button>
//       </div>

//       {/* Chats List */}
//       <div className="flex-1 overflow-y-auto custom-scrollbar">
//         {loading && (
//           <div className="p-3 text-sm text-gray-400 animate-pulse">
//             Loading chats...
//           </div>
//         )}
//         {chats.length === 0 && !loading && (
//           <div className="p-3 text-sm text-gray-400 italic">
//             No chats yet. Start a new one!
//           </div>
//         )}
//         {chats.map((chat) => (
//           <div
//             key={chat.id}
//             onClick={() => onSelectChat(chat.id)}
//             className={`group p-3 cursor-pointer border-b border-gray-800 hover:bg-gray-700 transition-all duration-200 ${
//               chat.id === currentChatId ? 'bg-gray-700 shadow-inner' : ''
//             }`}
//           >
//             <div className="truncate font-medium group-hover:text-green-400">
//               {chat.title || 'Untitled Chat'}
//             </div>
//             <div className="text-xs text-gray-400 mt-1">
//               {new Date(chat.created_at).toLocaleString()}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Footer */}
//       <div className="p-3 text-xs text-gray-400 border-t border-gray-700 text-center">
//         Powered by <span className="text-green-400">Himanshu's Cointab Gemma:2b</span>
//       </div>
//     </div>
//   );
// }

// 'use client';
// import { useEffect, useState } from 'react';
// import { fetchChats, createChat, deleteChat } from '../lib/api'; // <-- Added deleteChat

// type Chat = {
//   id: string;
//   title: string | null;
//   created_at: string;
// };

// export default function Sidebar({
//   currentChatId,
//   onSelectChat,
// }: {
//   currentChatId: string | null;
//   onSelectChat: (id: string) => void;
// }) {
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [loading, setLoading] = useState(false);

//   async function load() {
//     setLoading(true);
//     try {
//       const data = await fetchChats();
//       setChats(data);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   async function handleNewChat() {
//     const newChat = await createChat();
//     setChats((prev) => [newChat, ...prev]);
//     onSelectChat(newChat.id);
//   }

//   async function handleDeleteChat(e: React.MouseEvent, chatId: string) {
//     e.stopPropagation(); // Prevent chat selection on delete click
//     if (confirm('Are you sure you want to delete this chat?')) {
//       await deleteChat(chatId);
//       setChats((prev) => prev.filter((chat) => chat.id !== chatId));
//     }
//   }

//   return (
//     <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-lg border-r border-gray-700">
//       {/* Header */}
//       <div className="p-4 border-b border-gray-700 text-lg font-semibold tracking-wide bg-gray-900 flex items-center justify-between">
//         <span className="text-green-400">💬 Chats</span>
//         <button
//           onClick={handleNewChat}
//           className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-500 transition-all duration-300"
//         >
//           + New
//         </button>
//       </div>

//       {/* Chats List */}
//       <div className="flex-1 overflow-y-auto custom-scrollbar">
//         {loading && (
//           <div className="p-3 text-sm text-gray-400 animate-pulse">
//             Loading chats...
//           </div>
//         )}
//         {chats.length === 0 && !loading && (
//           <div className="p-3 text-sm text-gray-400 italic">
//             No chats yet. Start a new one!
//           </div>
//         )}
//         {chats.map((chat) => (
//           <div
//             key={chat.id}
//             onClick={() => onSelectChat(chat.id)}
//             className={`group p-3 cursor-pointer border-b border-gray-800 hover:bg-gray-700 transition-all duration-200 flex justify-between items-center ${
//               chat.id === currentChatId ? 'bg-gray-700 shadow-inner' : ''
//             }`}
//           >
//             <div className="flex-1">
//               <div className="truncate font-medium group-hover:text-green-400">
//                 {chat.title || 'Untitled Chat'}
//               </div>
//               <div className="text-xs text-gray-400 mt-1">
//                 {new Date(chat.created_at).toLocaleString()}
//               </div>
//             </div>
//             <button
//               onClick={(e) => handleDeleteChat(e, chat.id)}
//               className="text-red-400 hover:text-red-600 ml-2 p-1 rounded hover:bg-gray-800 transition-colors"
//               title="Delete chat"
//             >
//               🗑
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Footer */}
//       <div className="p-3 text-xs text-gray-400 border-t border-gray-700 text-center">
//         Powered by <span className="text-green-400">Himanshu's Cointab Gemma:2b</span>
//       </div>
//     </div>
//   );
// }

'use client';
import { useEffect, useState } from 'react';
import { fetchChats, createChat, deleteChat } from '../lib/api';

type Chat = {
  id: string;
  title: string | null;
  created_at: string;
};

export default function Sidebar({
  currentChatId,
  onSelectChat,
  refreshKey, // Add refreshKey
}: {
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  refreshKey?: number;
}) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchChats();
      setChats(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [refreshKey]); // here it will reload things when refreshKey change hogaa.

  async function handleNewChat() {
    const newChat = await createChat();
    setChats((prev) => [newChat, ...prev]);
    onSelectChat(newChat.id);
  }

  async function handleDeleteChat(e: React.MouseEvent, chatId: string) {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat?')) {
      await deleteChat(chatId);
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    }
  }

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-lg border-r border-gray-700">
      {/* Ye Header vala part hai */}
      <div className="p-4 border-b border-gray-700 text-lg font-semibold tracking-wide bg-gray-900 flex items-center justify-between">
        <span className="text-green-400">💬 Chats</span>
        <button
          onClick={handleNewChat}
          className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-500 transition-all duration-300"
        >
          + New
        </button>
      </div>

      {/* Ye Chats List ka part hai. */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading && (
          <div className="p-3 text-sm text-gray-400 animate-pulse">
            Loading chats...
          </div>
        )}
        {chats.length === 0 && !loading && (
          <div className="p-3 text-sm text-gray-400 italic">
            No chats yet. Start a new one!
          </div>
        )}
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`group p-3 cursor-pointer border-b border-gray-800 hover:bg-gray-700 transition-all duration-200 flex justify-between items-center ${
              chat.id === currentChatId ? 'bg-gray-700 shadow-inner' : ''
            }`}
          >
            <div className="flex-1">
              <div className="truncate font-medium group-hover:text-green-400">
                {chat.title || 'Untitled Chat'}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(chat.created_at).toLocaleString()}
              </div>
            </div>
            <button
              onClick={(e) => handleDeleteChat(e, chat.id)}
              className="text-red-400 hover:text-red-600 ml-2 p-1 rounded hover:bg-gray-800 transition-colors"
              title="Delete chat"
            >
              🗑
            </button>
          </div>
        ))}
      </div>

      {/* Ye last mein Footer */}
      <div className="p-3 text-xs text-gray-400 border-t border-gray-700 text-center">
        Powered by <span className="text-green-400">Himanshu's Cointab Gemma:2b</span>
      </div>
    </div>
  );
}
