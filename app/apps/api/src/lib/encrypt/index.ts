function fallbackHash(len = 12) {
  return [...crypto.getRandomValues(new Uint8Array(len))]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, len);
}

export function safeNameOrHash(user: { name: string }) {
  const sanitized = user.name
    .replace(/[^\da-zA-Z-]/g, "")
    .slice(0, 20);

  return sanitized || fallbackHash(12);
}