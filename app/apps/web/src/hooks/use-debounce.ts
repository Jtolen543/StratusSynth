import { useEffect } from "react";

export function useDebounce(value: any, callback: () => void, interval: number = 30000) {
    useEffect(() => {
        const id = setTimeout(callback, interval)
        return () => clearTimeout(id)
    }, [value, callback, interval])
}