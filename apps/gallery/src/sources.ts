/**
 * Component source, read from the real files at build time.
 *
 * Using Vite's `?raw` import means the "Source" tab cannot drift from the
 * actual implementation — there is no copy of the code to keep in sync.
 */
import avatarSource from '../../../packages/ui/src/components/Avatar/Avatar.tsx?raw';
import avatarGroupSource from '../../../packages/ui/src/components/Avatar/AvatarGroup.tsx?raw';
import badgeSource from '../../../packages/ui/src/components/Badge/Badge.tsx?raw';
import buttonSource from '../../../packages/ui/src/components/Button/Button.tsx?raw';
import cardSource from '../../../packages/ui/src/components/Card/Card.tsx?raw';

export const BUTTON_SOURCE: string = buttonSource;
export const BADGE_SOURCE: string = badgeSource;
export const CARD_SOURCE: string = cardSource;
export const AVATAR_SOURCE: string = avatarSource;
export const AVATAR_GROUP_SOURCE: string = avatarGroupSource;
