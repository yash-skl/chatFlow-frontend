const AVATAR_GRADIENTS = [
  "from-indigo-500 to-indigo-600",
  "from-violet-500 to-violet-600",
  "from-purple-500 to-purple-600",
  "from-blue-500 to-blue-600",
  "from-cyan-500 to-cyan-600",
  "from-fuchsia-500 to-fuchsia-600",
];

export function getAvatarGradient(username = "") {
  const charCode = username.charCodeAt(0) || 0;
  return AVATAR_GRADIENTS[charCode % AVATAR_GRADIENTS.length];
}
