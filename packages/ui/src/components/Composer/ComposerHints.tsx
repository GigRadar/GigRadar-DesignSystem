import { color, component, textStyle } from '@gigradar/theme';
import type { ReactNode } from 'react';
import { CommandKey, Key, PlatformMark, Plus } from './markGlyphs.js';

const { markTooltip } = component.middle.composer;

/**
 * The body of the tooltip each composer tab opens.
 *
 * A heading naming who ends up reading the message, and a sentence saying where
 * it goes. The tabs themselves only have room for one word each, and "Message"
 * versus "Note" does not say that one reaches the client and the other does not
 * — which is the single most consequential thing about the choice.
 */
export function ComposerModeHint({ mode }: { mode: 'message' | 'note' }) {
  const message = mode === 'message';

  return (
    <span
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: markTooltip.keyGap,
      }}
    >
      <span
        style={{
          ...textStyle.mMedium,
          // The Laziza orange on the note, the brand on the message: the
          // heading is coloured by whose surface the text lands on.
          color: message ? color.main.black : color.accent.laziza.main,
        }}
      >
        {message ? 'Reply to your client' : 'Talk to Laziza AI or your teammates'}
      </span>
      <span style={{ ...textStyle.sRegular, color: color.main.description }}>
        {message
          ? 'Messages sent here are delivered to Upwork and visible to everyone in the conversation, including the client.'
          : 'Laziza AI assistant tracks meetings, manages clients, and offers smart suggestions and communication within your team, these interactions are internal and visible only to your team, not to clients.'}
      </span>
    </span>
  );
}

/**
 * The body of the tooltip the send button opens — its name, then the shortcut
 * on each platform.
 *
 * Same shape as `MarkShortcut`, and for the same reason: a person who sends
 * many messages a day reaches for the keystroke, and the button is where they
 * find out what it is. Both platforms are always drawn rather than the tooltip
 * picking the viewer's, so the card can be reviewed in the gallery.
 */
export function SendShortcut() {
  return (
    <span
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: markTooltip.gap,
      }}
    >
      <span style={{ ...textStyle.sMedium, color: color.main.description }}>Send Message</span>
      <ShortcutRow platform="mac" />
      <ShortcutRow platform="windows" />
    </span>
  );
}

/** One platform's line: its mark, the two keys, and what they do. */
function ShortcutRow({ platform }: { platform: 'mac' | 'windows' }) {
  const mac = platform === 'mac';

  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: markTooltip.rowGap }}>
      <PlatformMark platform={mac ? 'mac' : 'windows'} />
      <span style={{ display: 'flex', alignItems: 'center', gap: markTooltip.keyGap }}>
        {mac ? <CommandKey /> : <Key>Ctrl</Key>}
        <Plus />
        <Key>{mac ? 'return' : 'Enter'}</Key>
        <span
          style={{ ...textStyle.sRegular, color: color.main.description, whiteSpace: 'nowrap' }}
        >
          &nbsp;to send message
        </span>
      </span>
    </span>
  );
}

