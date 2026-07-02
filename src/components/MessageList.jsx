import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";

function getUserId(userRef) {
  if (!userRef) return null;
  return typeof userRef === "object" ? userRef._id : userRef;
}

function EmptyState({ selectedUser }) {
  if (!selectedUser) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
          💬
        </div>
        <p className="text-base font-medium text-slate-300">
          Select a conversation and start chatting.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Pick someone from the sidebar to begin.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
        💬
      </div>
      <p className="text-base font-medium text-slate-300">
        Start chatting with{" "}
        <span className="text-indigo-400">{selectedUser.username}</span>
      </p>
      <p className="mt-2 text-sm text-slate-500">Send your first message.</p>
    </div>
  );
}

function MessageList({ messages = [], currentUser, selectedUser, isTyping }) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!currentUser) {
    return (
      <div className="flex flex-1 items-center justify-center overflow-y-auto px-6">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return <EmptyState selectedUser={selectedUser} />;
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4"
    >
      {messages.map((message) => {
        const isSender =
          String(getUserId(message.senderId)) === String(currentUser._id);

        return (
          <MessageBubble
            key={message._id}
            message={message}
            isSender={isSender}
          />
        );
      })}

      {isTyping && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="flex gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" />
          </span>
          {selectedUser?.username} is typing...
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
