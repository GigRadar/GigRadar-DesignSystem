import { component } from '@gigradar/theme';

const { bubble } = component.middle;

/**
 * Whether a message is still young enough to change.
 *
 * Upwork allows an edit or a withdrawal for an hour after sending; past that the
 * server refuses, so the hover bar stops offering the controls.
 *
 * No `sentAt` means the screen does not track send times, and the safe answer
 * there is yes: hiding a control the person is entitled to is worse than showing
 * one the server may refuse and report on.
 *
 * Shared by `BubbleChat` and `AttachmentBubble` — the rule is about the message,
 * not about which of the two is drawing it.
 */
export function withinEditWindow(sentAt: Date | number | undefined): boolean {
  if (sentAt == null) return true;
  const sent = sentAt instanceof Date ? sentAt.getTime() : sentAt;
  return Date.now() - sent < bubble.editWindowMs;
}
