type EasingFunction = (t: number) => number
export const ease = {
    linear: (t: number): number => t,

    // Quadratic
    inQuad: (t: number): number => t * t,
    outQuad: (t: number): number => t * (2 - t),
    inOutQuad: (t: number): number =>
        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,

    // Cubic
    inCubic: (t: number): number => t * t * t,
    outCubic: (t: number): number => 1 - Math.pow(1 - t, 3),
    inOutCubic: (t: number): number =>
        t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2,

    // Quartic
    inQuart: (t: number): number => t * t * t * t,
    outQuart: (t: number): number => 1 - Math.pow(1 - t, 4),
    inOutQuart: (t: number): number =>
        t < 0.5
            ? 8 * t * t * t * t
            : 1 - Math.pow(-2 * t + 2, 4) / 2,

    // Quintic
    inQuint: (t: number): number => t * t * t * t * t,
    outQuint: (t: number): number => 1 - Math.pow(1 - t, 5),
    inOutQuint: (t: number): number =>
        t < 0.5
            ? 16 * t * t * t * t * t
            : 1 - Math.pow(-2 * t + 2, 5) / 2,

    // Sine
    inSine: (t: number): number =>
        1 - Math.cos((t * Math.PI) / 2),
    outSine: (t: number): number =>
        Math.sin((t * Math.PI) / 2),
    inOutSine: (t: number): number =>
        -(Math.cos(Math.PI * t) - 1) / 2,

    // Exponential
    inExpo: (t: number): number =>
        t === 0 ? 0 : Math.pow(2, 10 * t - 10),
    outExpo: (t: number): number =>
        t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    inOutExpo: (t: number): number =>
        t === 0
            ? 0
            : t === 1
                ? 1
                : t < 0.5
                    ? Math.pow(2, 20 * t - 10) / 2
                    : (2 - Math.pow(2, -20 * t + 10)) / 2,

    // Circular
    inCirc: (t: number): number =>
        1 - Math.sqrt(1 - t * t),
    outCirc: (t: number): number =>
        Math.sqrt(1 - Math.pow(t - 1, 2)),
    inOutCirc: (t: number): number =>
        t < 0.5
            ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
            : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2,
} as const


export function lerp(
    from: number,
    to: number,
    t: number,
    easing: EasingFunction = ease.linear
): number {
    return from + (to - from) * easing(t)
}