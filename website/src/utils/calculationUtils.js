export function clamp(value, bound) {
    return Math.max(Math.min(value, bound), -bound);
}


export function getDate() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    return `${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}${seconds.toString().padStart(2, '0')}`;
}



export function getDayOfMonth() {
    const now = new Date();
    const dayOfMonth = now.getDate();

    return dayOfMonth;
}


export function deepEquals(a, b) {
    if (a === b) return true; // Strict equality for primitives and same object reference

    if (a == null || typeof a !== 'object' ||
        b == null || typeof b !== 'object') {
        return false; // Not objects or one is null/undefined
    }

    // Check if both are arrays
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!deepEquals(a[i], b[i])) return false;
        }
        return true;
    }

    // Check if both are plain objects
    if (a.constructor !== Object || b.constructor !== Object) {
        return false; // Not plain objects (e.g., Dates, RegExps, custom classes)
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
        if (!keysB.includes(key) || !deepEquals(a[key], b[key])) {
            return false;
        }
    }

    return true;
}