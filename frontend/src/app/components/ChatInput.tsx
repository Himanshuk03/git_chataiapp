'use client';
import { useState } from 'react';
export default function ChatInput({
  onSend,
  onStop,
  isGenerating,
}: {
  onSend: (msg: string) => void;
  onStop: () => void;
  isGenerating: boolean;
}) {
  const [input, setInput] = useState('');

  function handleSend() {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  }

  return (
    <div className="flex p-3 border-t bg-white">
      <input
        className="flex-1 border p-2 rounded mr-2 outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Type a message..."/>
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={isGenerating}>
        Send
      </button>
      {isGenerating && (
        <button
          onClick={onStop}
          className="ml-2 bg-red-500 text-white px-4 py-2 rounded">
          Stop
        </button>
      )}
    </div>
  );
}
