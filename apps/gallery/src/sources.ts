/**
 * Component source, read from the real files at build time.
 *
 * Using Vite's `?raw` import means the "Source" tab cannot drift from the
 * actual implementation — there is no copy of the code to keep in sync.
 */
import avatarSource from '../../../packages/ui/src/components/Avatar/Avatar.tsx?raw';
import avatarGroupSource from '../../../packages/ui/src/components/Avatar/AvatarGroup.tsx?raw';

export const AVATAR_SOURCE: string = avatarSource;
export const AVATAR_GROUP_SOURCE: string = avatarGroupSource;
