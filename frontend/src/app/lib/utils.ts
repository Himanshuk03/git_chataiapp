export function deriveTitleFromMessage(text: string, max = 6) {
  return text
    .trim()
    .split(/\s+/)
    .slice(0, max)
    .join(' ')
    .replace(/[^\w\s-]/g, '');
}
