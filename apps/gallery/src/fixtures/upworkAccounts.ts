import type { UpworkAccount } from '@gigradar/ui';

/**
 * The accounts Figma draws across the screen's states.
 *
 * Shared between the page's demos so the "Select" state and the "Fill" state
 * show the same people — the two are the same list at different moments, and
 * a reader comparing them should not have to work out whether the names
 * changed too.
 *
 * No `avatarSrc`: the design's photos are stock portraits that would have to
 * be committed as binaries to survive the Figma asset URLs expiring, and the
 * avatar falls back to tinted initials hashed from the name, which is a real
 * state of the component rather than a stand-in.
 */
export const ACCOUNTS: UpworkAccount[] = [
  { id: 'olivia', name: 'Olivia Smith', status: 'suspended' },
  { id: 'isabella', name: 'Isabella Brown', status: 'error' },
  { id: 'harper', name: 'Harper Garcia', status: 'active' },
];

/** Two more, for the states that draw five connected accounts. */
export const MORE_ACCOUNTS: UpworkAccount[] = [
  ...ACCOUNTS,
  { id: 'roberto', name: 'Roberto Diaz', status: 'active' },
  { id: 'daniel', name: 'Daniel Christopher', status: 'active' },
];

/**
 * The full list behind the "Fill +99" state — every status the pill draws,
 * against a capacity the accounts exactly fill.
 */
export const FULL_ACCOUNTS: UpworkAccount[] = [
  { id: 'emily', name: 'Emily Carter', status: 'active' },
  { id: 'sarah', name: 'Sarah Johnson', status: 'suspended' },
  { id: 'ava', name: 'Ava Thompson', status: 'active' },
  { id: 'mia', name: 'Mia Davis', status: 'active' },
  { id: 'sophia-w', name: 'Sophia Wilson', status: 'active' },
  { id: 'isabella', name: 'Isabella Brown', status: 'error' },
  { id: 'charlotte', name: 'Charlotte Johnson', status: 'active' },
  { id: 'amelia', name: 'Amelia Martinez', status: 'suspended' },
  { id: 'harper', name: 'Harper Garcia', status: 'active' },
  { id: 'abigail', name: 'Abigail Lee', status: 'error' },
  { id: 'ella', name: 'Ella Walker', status: 'active' },
  { id: 'evelyn', name: 'Evelyn Rodriguez', status: 'active' },
  { id: 'liam', name: 'Liam Johnson', status: 'inactive' },
  { id: 'sophia-l', name: 'Sophia Lee', status: 'active' },
  { id: 'noah-s', name: 'Noah Smith', status: 'pending' },
];
