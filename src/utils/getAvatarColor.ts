export default function getAvatarColor(seed: number | string): string {
    const str = String(seed);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }

    const HUE_STEPS = 36;
    const hue = (Math.abs(hash) % HUE_STEPS) * (360 / HUE_STEPS);
    const saturation = 60;
    const lightness = 55;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}