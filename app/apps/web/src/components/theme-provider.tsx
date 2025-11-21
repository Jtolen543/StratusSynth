import { createContext, useContext, useEffect, useState } from "react"
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react" 
type Theme = "dark" | "light" | "system"
 
type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}
 
type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}
 
const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}
 
const ThemeProviderContext = createContext<ThemeProviderState>(initialState)
 
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
 
  useEffect(() => {
    const root = window.document.documentElement
 
    root.classList.remove("light", "dark")
 
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
 
      root.classList.add(systemTheme)
      return
    }
 
    root.classList.add(theme)
  }, [theme])
 
  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }
 
  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}
 
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
 
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
 
  return context
}
 
export function ModeToggle() {
  const { setTheme } = useTheme()
 
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[10rem] rounded-lg border border-foreground/20 bg-gradient-to-br from-background 
        via-background to-muted/60 p-3 text-foreground shadow-lg outline outline-1 outline-foreground/50 backdrop-blur-sm"
      >
        <DropdownMenuItem onClick={() => setTheme("light")} className="outline-none hover:bg-muted hover:cursor-pointer rounded transition duration-150 rounded px-1">
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="outline-none hover:bg-muted hover:cursor-pointer rounded transition duration-150 rounded px-1">
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="outline-none hover:bg-muted hover:cursor-pointer rounded transition duration-150 rounded px-1">
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
