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