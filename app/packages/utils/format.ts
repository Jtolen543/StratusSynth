type DeviceType = "Phone" | "Tablet" | "Desktop" | "Unknown";
type BrowserType = "Chrome" | "Safari" | "Firefox" | "Edge" | "Opera" | "Brave" | "Chromium" | "Unknown";
type SystemType = "Windows" | "macOS" | "Linux" | "Android" | "iOS" | "Unknown"

export function getSessionInfo(userAgent: string | undefined | null) {
  let device: DeviceType, system: SystemType, browser: BrowserType;
  device = system = browser = "Unknown"

  if (!userAgent) return {device, system, browser}

  const ua = userAgent.toLowerCase()

  if (/iphone|android.*mobile|windows phone/.test(ua)) device = "Phone";
  else if (/ipad|android(?!.*mobile)|tablet|kindle|silk/.test(ua)) device = "Tablet";
  else if (/windows nt|macintosh|x11|linux/i.test(ua)) device = "Desktop";

  if (ua.includes("windows")) system = "Windows";
  else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) system = "iOS";
  else if (ua.includes("macintosh")) system = "macOS";
  else if (ua.includes("android")) system = "Android";
  else if (ua.includes("linux")) system = "Linux";

  if (ua.includes("edg/") || ua.includes("edga/")) browser = "Edge";
  else if (ua.includes("opr/") || ua.includes("opera")) browser = "Opera";
  else if (ua.includes("firefox/")) browser = "Firefox";
  else if (ua.includes("chromium/")) browser = "Chromium";
  else if (ua.includes("chrome/") && !ua.includes("edg/") && !ua.includes("opr/")) browser = "Chrome";
  else if (ua.includes("safari/") && !ua.includes("chrome/") && !ua.includes("chromium/")) browser = "Safari";
  else if (ua.includes("brave/")) browser = "Brave";

  return {device, system, browser}
}

export function toTitle(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}