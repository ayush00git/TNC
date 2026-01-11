type AnyFunction = (...args: any[]) => any

export function throttle<T extends AnyFunction>(
    fn: T,
    wait: number
): (...args: Parameters<T>) => void {
    let lastTime = 0
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let queuedArgs: Parameters<T> | null = null
    let queuedThis: ThisParameterType<T> | null = null

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        const now = Date.now()
        const remaining = wait - (now - lastTime)

        if (remaining <= 0) {
            // Run immediately
            if (timeoutId) {
                clearTimeout(timeoutId)
                timeoutId = null
            }

            lastTime = now
            fn.apply(this, args)
        } else if (!timeoutId) {
            // Queue ONE trailing call
            queuedArgs = args
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            queuedThis = this

            timeoutId = setTimeout(() => {
                lastTime = Date.now()
                timeoutId = null

                if (queuedArgs) {
                    fn.apply(queuedThis as ThisParameterType<T>, queuedArgs)
                    queuedArgs = queuedThis = null
                }
            }, remaining)
        }
        // else: ignored
    }
}
