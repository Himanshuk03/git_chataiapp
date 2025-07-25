// 'use client';
// import { useState } from 'react';
// import Sidebar from './components/Sidebar';
// import ChatContainer from './components/ChatContainer';

// export default function HomePage() {
//   const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
//   return (
//     <div className="flex h-screen">
//       <Sidebar currentChatId={selectedChatId} onSelectChat={setSelectedChatId} />
//       {selectedChatId ? (
//         <ChatContainer chatId={selectedChatId} />
//       ) : (
//         <div className="flex-1 flex items-center justify-center text-gray-500">
//           Select or create a chat to start
//         </div>
//       )}
//     </div>
//   );
// }

// 'use client';
// import { useState } from 'react';
// import Sidebar from './components/Sidebar';
// import ChatContainer from './components/ChatContainer';

// export default function HomePage() {
//   const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
//       {/* Sidebar */}
//       <Sidebar currentChatId={selectedChatId} onSelectChat={setSelectedChatId} />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Top Heading */}
//         <div className="px-6 py-4 bg-white border-b border-gray-200 shadow-sm flex items-center">
//           <h1 className="text-xl font-bold text-gray-800 tracking-wide">
//             Himanshu's Cointab Chat App
//           </h1>
//         </div>

//         {/* Chat Area */}
//         <div className="flex-1 flex items-center justify-center p-6">
//           {selectedChatId ? (
//             <ChatContainer chatId={selectedChatId} />
//           ) : (
//             <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center border border-gray-200">
//               <h2 className="text-lg font-semibold text-gray-700 mb-4">
//                 Select or create a chat to start
//               </h2>
//               <input
//                 type="text"
//                 placeholder="Type a quick note..."
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition mb-4"
//               />
//               <p className="text-sm text-gray-500">
//                 Or click <span className="font-semibold text-green-500">+ New</span> on the left panel.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
//------------------------------------------------------------------------------
// 'use client';
// import { useState } from 'react';
// import Sidebar from './components/Sidebar';
// import ChatContainer from './components/ChatContainer';
// import { createChat } from './lib/api'; // Import createChat API

// export default function HomePage() {
//   const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
//   const [newChatTitle, setNewChatTitle] = useState('');
//   const [refreshKey, setRefreshKey] = useState(0); // Used to refresh Sidebar

//   async function handleCreateChat() {
//     const title = newChatTitle.trim();
//     if (!title) return;

//     try {
//       const chat = await createChat(title); // Create chat with custom title
//       setSelectedChatId(chat.id);           // Auto select new chat
//       setNewChatTitle('');                  // Reset input
//       setRefreshKey((prev) => prev + 1);    // Trigger sidebar reload
//     } catch (error) {
//       console.error('Failed to create chat:', error);
//       alert('Could not create chat.');
//     }
//   }

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
//       {/* Sidebar */}
//       <Sidebar
//         currentChatId={selectedChatId}
//         onSelectChat={setSelectedChatId}
//         refreshKey={refreshKey} // Pass refresh key to reload chats
//       />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Top Heading */}
//         <div className="px-6 py-4 bg-white border-b border-gray-200 shadow-sm flex items-center">
//           <h1 className="text-xl font-bold text-gray-800 tracking-wide">
//             Himanshu's Cointab Chat App
//           </h1>
//         </div>

//         {/* Chat Area */}
//         <div className="flex-1 flex items-center justify-center p-6">
//           {selectedChatId ? (
//             <ChatContainer chatId={selectedChatId} />
//           ) : (
//             <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center border border-gray-200">
//               <h2 className="text-lg font-semibold text-gray-700 mb-4">
//                 Select or create a chat to start
//               </h2>
//               <input
//                 type="text"
//                 value={newChatTitle}
//                 onChange={(e) => setNewChatTitle(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleCreateChat()}
//                 placeholder="Type a quick note..."
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition mb-4"
//               />
//               <button
//                 onClick={handleCreateChat}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition"
//               >
//                 Create Chat
//               </button>
//               <p className="text-sm text-gray-500 mt-4">
//                 Or click <span className="font-semibold text-green-500">+ New</span> on the left panel.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
//--------------------------------------------------------------------------
'use client';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatContainer from './components/ChatContainer';
import { createChat } from './lib/api'; // Import createChat API
import AuthModal from './components/AuthModal'; // <-- Login/Signup modal
import { useAuth } from './context/AuthContext'; // <-- Authentication context

export default function HomePage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [refreshKey, setRefreshKey] = useState(0); // Used to refresh Sidebar
  const [authModalOpen, setAuthModalOpen] = useState(false); // For modal

  const { user, logout } = useAuth(); // Get user from context

  async function handleCreateChat() {
    const title = newChatTitle.trim();
    if (!title) return;

    try {
      const chat = await createChat(title); // Create chat with custom title
      setSelectedChatId(chat.id);           // Auto select new chat
      setNewChatTitle('');                  // Reset input
      setRefreshKey((prev) => prev + 1);    // Trigger sidebar reload
    } catch (error) {
      console.error('Failed to create chat:', error);
      alert('Could not create chat.');
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      {/* Sidebar */}
      <Sidebar
        currentChatId={selectedChatId}
        onSelectChat={setSelectedChatId}
        refreshKey={refreshKey} // Pass refresh key to reload chats
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Heading */}
        <div className="px-6 py-4 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 tracking-wide">
            Himanshu's Cointab Chat App
          </h1>
          {/* Login / Logout Section */}
          <div>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-700 text-sm">{user.email}</span>
                <button
                  onClick={logout}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-400 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-500 transition"
              >
                Login / Signup
              </button>
            )}
          </div>
        </div>

        {/* Chat Area
        <div className="flex-1 flex items-center justify-center p-6">
          {selectedChatId ? (
            <ChatContainer chatId={selectedChatId} />
          ) : (
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Select or create a chat to start
              </h2>
              <input
                type="text"
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateChat()}
                placeholder="Type a quick note..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition mb-4"
              />
              <button
                onClick={handleCreateChat}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition"
              >
                Create Chat
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Or click <span className="font-semibold text-green-500">+ New</span> on the left panel.
              </p>
            </div>
          )}
        </div> */}
        
      {/* Chat Area */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        {selectedChatId ? (
          <ChatContainer chatId={selectedChatId} />
        ) : (
          <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full mx-auto text-center border border-gray-200 mt-12">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Select or create a chat to start
            </h2>
            <input
              type="text"
              value={newChatTitle}
              onChange={(e) => setNewChatTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateChat()}
              placeholder="Type a quick note..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition mb-4"
            />
            <button
              onClick={handleCreateChat}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition"
            >
              Create Chat
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Or click <span className="font-semibold text-green-500">+ New</span> on the left panel.
            </p>
          </div>
        )}
      </div>

      </div>

      {/* authorisation of Auth Modal not done till now */}
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
