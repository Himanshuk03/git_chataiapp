// import './globals.css';
// import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Himanshu kaa Local Chat App aahe',
//   description: 'Chat with gemma:1b via Ollama + Node backend',
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className="h-screen w-screen bg-gray-100 text-gray-900">{children}</body>
//     </html>
//   );
// }

import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

export const metadata: Metadata = {
  title: 'Himanshu kaa Local Chat App aahe',
  description: 'Chat with gemma:1b via Ollama + Node backend',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="h-screen w-screen bg-gray-100 text-gray-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
