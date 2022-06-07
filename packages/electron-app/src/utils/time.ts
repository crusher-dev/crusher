// Should only be called where nodejs is available
export function now(): number {
    const time = process.hrtime()
    return time[0] * 1000 + time[1] / 1000000
}
