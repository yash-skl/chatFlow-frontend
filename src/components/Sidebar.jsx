import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const AVATAR_GRADIENTS = [
  "from-indigo-500 to-indigo-600",
  "from-violet-500 to-violet-600",
  "from-purple-500 to-purple-600",
  "from-blue-500 to-blue-600",
  "from-cyan-500 to-cyan-600",
  "from-fuchsia-500 to-fuchsia-600",
];

function getAvatarGradient(username = "") {
  const charCode = username.charCodeAt(0) || 0;
  return AVATAR_GRADIENTS[charCode % AVATAR_GRADIENTS.length];
}

function UserAvatar({ username, size = "md", isSelected = false }) {
  const sizeClasses =
    size === "sm" ? "h-9 w-9 text-sm" : "h-11 w-11 text-base";

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white shadow-md ${getAvatarGradient(username)} ${sizeClasses}`}
    >
      {username.charAt(0).toUpperCase()}
      {isSelected && (
        <span className="absolute bottom-0.5 left-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-violet-400" />
      )}
    </div>
  );
}

function OnlineIndicator({ isOnline }) {
  return (
    <span
      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-900 ${
        isOnline ? "bg-emerald-400" : "bg-zinc-600"
      }`}
      title={isOnline ? "Online" : "Offline"}
    />
  );
}

function UserItem({ user, isSelected, isOnline, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(user)}
      className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
        isSelected
          ? "bg-indigo-500/20 ring-1 ring-indigo-400/30"
          : "hover:bg-white/5"
      }`}
    >
      <div className="relative">
        <UserAvatar username={user.username} isSelected={isSelected} />
        <OnlineIndicator isOnline={isOnline} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-white">{user.username}</p>
        <p className="truncate text-sm text-slate-500">
          {isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </button>
  );
}

function UserList({ users, selectedUser, setSelectedUser, onlineUsers }) {
  if (users.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center">
        <p className="text-sm text-slate-500">No users found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 px-2">
      {users.map((user) => (
        <UserItem
          key={user._id}
          user={user}
          isSelected={selectedUser?._id === user._id}
          isOnline={onlineUsers.some((id) => String(id) === String(user._id))}
          onSelect={setSelectedUser}
        />
      ))}
    </div>
  );
}

function Sidebar({
  users = [],
  selectedUser,
  setSelectedUser,
  onlineUsers = [],
  currentUser,
}) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const user = useMemo(() => {
    if (currentUser) return currentUser;
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, [currentUser]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter((u) => u.username.toLowerCase().includes(query));
  }, [users, search]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-r border-white/10 bg-slate-950/80 backdrop-blur-xl">
      {/* App Logo */}
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
            <span className="text-lg">💬</span>
          </div>
          <h1 className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-xl font-semibold tracking-tight text-transparent">
            ChatFlow
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="border-b border-white/10 px-4 py-4">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto py-3">
        <UserList
          users={filteredUsers}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          onlineUsers={onlineUsers}
        />
      </div>

      {/* Current User */}
      {user && (
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <UserAvatar username={user.username} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {user.username}
                </p>
                <p className="text-xs text-slate-500">You</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;