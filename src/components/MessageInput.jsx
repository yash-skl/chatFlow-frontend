import { useEffect, useRef, useState } from "react";

function MessageInput({
  onSend,
  onTyping,
  onStopTyping,
  disabled = false,
  placeholder = "Type a message...",
}) {
  const [content, setContent] = useState("");
  const typingTimeoutRef = useRef(null);

  const clearTypingTimeout = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleStopTyping = () => {
    clearTypingTimeout();
    onStopTyping?.();
  };

  const handleTyping = () => {
    if (disabled) return;

    onTyping?.();
    clearTypingTimeout();

    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping?.();
    }, 2000);
  };

  useEffect(() => {
    return () => clearTypingTimeout();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = content.trim();
    if (!trimmed || disabled) return;

    handleStopTyping();
    onSend(trimmed);
    setContent("");
  };

  const handleChange = (e) => {
    setContent(e.target.value);
    if (e.target.value.trim()) {
      handleTyping();
    } else {
      handleStopTyping();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex shrink-0 items-center gap-3 border-t border-white/10 bg-slate-950/60 px-4 py-4 backdrop-blur-xl"
    >
      <button
        type="button"
        disabled={disabled}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Emoji"
      >
        🙂
      </button>

      <input
        type="text"
        value={content}
        onChange={handleChange}
        onBlur={handleStopTyping}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-40"
      />

      <button
        type="submit"
        disabled={disabled || !content.trim()}
        className="shrink-0 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-7 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-violet-500 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Send
      </button>
    </form>
  );
}

export default MessageInput;
