export const EmojiRegex = /^(?:[^a-zA-Z0-9]){1,}/s;

export function trimLeftNonAlpha(str?: string) {
    if(!str) return '';
    return str.replace(EmojiRegex, '').trim();
}
