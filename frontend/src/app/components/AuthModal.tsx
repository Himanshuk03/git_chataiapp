//Ye vaalaa part not done
'use client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void; }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (mode === 'login') await login(email, password);
      else await signup(email, password);
      onClose();
    } catch (err: any) {
      alert('Auth failed: ' + err.message);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex mb-4">
          <button
            className={`flex-1 ${mode === 'login' ? 'font-bold border-b-2 border-green-500' : ''}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 ${mode === 'signup' ? 'font-bold border-b-2 border-green-500' : ''}`}
            onClick={() => setMode('signup')}
          >
            Signup
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border p-2 rounded"
          />
          <button className="w-full bg-green-600 text-white p-2 rounded" type="submit">
            {mode === 'login' ? 'Login' : 'Signup'}
          </button>
        </form>

        <button className="mt-4 text-gray-500 text-sm underline" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
