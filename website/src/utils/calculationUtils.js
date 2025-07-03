export function clamp(value, bound) {
    return Math.max(Math.min(value, bound), -bound);
}


export function getCompleteDate() {
    const now = new Date();

    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();
    const dayOfMonth = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    return `${year}-${(month + 1).toString().padStart(2, '0')}-${dayOfMonth.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}