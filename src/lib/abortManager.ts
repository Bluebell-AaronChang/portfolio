const controllers = new Set<AbortController>()

const keyMap = new Map<string, Set<AbortController>>()

const ABORT_WHITELIST: string[] = [
]

export function track(controller: AbortController, key?: string): void {
    if (key && ABORT_WHITELIST.includes(key)) return

    controllers.add(controller)

    if (!key) return
    if (!keyMap.has(key)) keyMap.set(key, new Set())
    keyMap.get(key)!.add(controller)
}

export function untrack(controller: AbortController): void {
    controllers.delete(controller)
    keyMap.forEach((set) => set.delete(controller))
}

export function abortAll(): void {
    controllers.forEach((c) => c.abort())
    controllers.clear()
    keyMap.clear()
}

export function abortKey(key: string): void {
    const set = keyMap.get(key)
    if (!set) return
    set.forEach((c) => c.abort())
    set.clear()
}

export function addToWhitelist(path: string): void {
    if (!ABORT_WHITELIST.includes(path)) {
        ABORT_WHITELIST.push(path)
    }
}

export function getTrackedCount(): number {
    return controllers.size
}
