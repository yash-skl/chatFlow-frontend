import { getAvatarGradient } from "../utils/avatar.js";

function ChatHeader({ selectedUser, isOnline = false, isTyping = false }) {
  if (!selectedUser) {
    return (
      <header className="flex h-18 shrink-0 items-center border-b border-white/10 bg-slate-950/60 px-6 py-4 backdrop-blur-xl">
        <p className="text-sm text-slate-500">Select a user to start chatting</p>
      </header>
    );
  }

  const statusText = isTyping
    ? `${selectedUser.username} is typing...`
    : isOnline
      ? "Online"
      : "Offline";

  return (
    <header className="flex h-18 shrink-0 items-center gap-3 border-b border-white/10 bg-slate-950/60 px-6 py-4 backdrop-blur-xl">
      <div className="relative">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white shadow-md ${getAvatarGradient(selectedUser.username)}`}
        >
          {selectedUser.username.charAt(0).toUpperCase()}
        </div>
        <span
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-950 ${
            isOnline ? "bg-emerald-400" : "bg-zinc-600"
          }`}
        />
      </div>

      <div className="min-w-0">
        <h2 className="truncate font-semibold text-white">{selectedUser.username}</h2>
        <p
          className={`text-sm ${
            isTyping ? "text-indigo-400" : isOnline ? "text-emerald-400" : "text-slate-500"
          }`}
        >
          {statusText}
        </p>
      </div>
    </header>
  );
}

export default ChatHeader;
