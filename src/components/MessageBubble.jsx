function formatTime(timestamp) {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessageStatus({ message }) {
  if (message.read) {
    return <span className="text-indigo-300">✓✓ Read</span>;
  }
  if (message.delivered) {
    return <span className="text-indigo-400">✓ Delivered</span>;
  }
  return null;
}

function MessageBubble({ message, isSender }) {
  const time = formatTime(message.createdAt);

  if (isSender) {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="max-w-[75%] rounded-2xl rounded-br-md bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm text-white shadow-lg shadow-indigo-500/20">
          {message.content}
        </div>
        <div className="flex items-center gap-1.5 pr-1 text-xs text-slate-500">
          <span>{time}</span>
          <MessageStatus message={message} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="max-w-[75%] rounded-2xl rounded-bl-md border border-white/10 bg-slate-800/80 px-4 py-2.5 text-sm text-slate-100">
        {message.content}
      </div>
      <span className="pl-1 text-xs text-slate-500">{time}</span>
    </div>
  );
}

export default MessageBubble;
