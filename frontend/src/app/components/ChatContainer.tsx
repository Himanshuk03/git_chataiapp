'use client';
import { useEffect, useRef, useState } from 'react';
import {
  fetchChat,
  sendMessage,
  stopMessage,
  updateChatTitle,
} from '../lib/api';
import { deriveTitleFromMessage } from '../lib/utils';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

type Message = {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
};
type ChatMeta = {
  id: string;
  title: string | null;
};

export default function ChatContainer({ chatId }: { chatId: string }) {
      const [messages, setMessages] = useState<Message[]>([]);
      const [isGenerating, setIsGenerating] = useState(false);
      const [chatMeta, setChatMeta] = useState<ChatMeta>({ id: chatId, title: null });
      const bottomRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        fetchChat(chatId).then((data) => {
          setMessages(data.messages ?? []);
          setChatMeta({ id: chatId, title: data.title ?? null });
        });
      }, [chatId]);

      useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [messages]);

      async function maybeAutoTitle(firstUserMessage: string) {
        if (chatMeta.title && chatMeta.title.trim().length > 0 && chatMeta.title !== 'Untitled chat') {
          return;
        }
        const title = deriveTitleFromMessage(firstUserMessage);
        try {
          await updateChatTitle(chatMeta.id, title);
          setChatMeta((m) => ({ ...m, title }));
        } catch {
          setChatMeta((m) => ({ ...m, title }));
        }
      }

      async function handleSend(content: string) {
        const hadNoTitleYet = !chatMeta.title || chatMeta.title === 'Untitled chat';

        // ye valaa part for appending user message
        setMessages((prev) => [...prev, { role: 'user', content }]);
        setIsGenerating(true);

        if (hadNoTitleYet) {
          // this will try to set the title in right
          void maybeAutoTitle(content);
        }

        try {
          const stream = await sendMessage(chatId, content);
          if (!stream) {
            setIsGenerating(false);
            return;
          }

          const reader = stream.getReader();
          const textDecoder = new TextDecoder();
          let assistantMessage = '';

          // ye valaa part will insert temporary assistant message placeholder
          setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            assistantMessage += textDecoder.decode(value);
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: 'assistant',
                content: assistantMessage,
              };
              return updated;
            });
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsGenerating(false);
        }
      }

      async function handleStop() {
        try {
          await stopMessage(chatId);
        } catch (e) {
          console.error(e);
        } finally {
          setIsGenerating(false);
        }
      }
      return (
      <div className="flex flex-col flex-1 bg-gray-50 rounded-lg shadow-inner overflow-hidden">
        {/* Ye Messages Area hai */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              role={msg.role === 'system' ? 'assistant' : msg.role}
              content={msg.content}
            />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Ye valaa Input Area hai */}
        <div className="border-t border-gray-200 bg-white p-3">
          <ChatInput onSend={handleSend} onStop={handleStop} isGenerating={isGenerating} />
        </div>
      </div>
    );

}
