/** Writes text to the system clipboard (HTTPS or localhost). */
export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}
