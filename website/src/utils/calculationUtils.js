export function clamp(value, bound) {
    return Math.max(Math.min(value, bound), -bound);
}