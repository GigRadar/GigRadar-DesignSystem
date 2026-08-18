import type { ApiStatusDetail } from '@gigradar/ui';

/**
 * The credential rows a connected key lists — Figma's own sample values
 * (node 2105:33513).
 */
export const API_KEY_DETAILS: ApiStatusDetail[] = [
  { label: 'Client ID', value: '4b9f8e2a7c1d3e5f' },
  { label: 'Secret Key', value: '9f82a3c7d1e5b4a69f82a3c7d1e59f82a', secret: true },
  { label: 'Created', value: '2025-11-20' },
];

/**
 * A rented key lists only when it was issued. The credentials are GigRadar's,
 * so there is nothing for the user to copy.
 */
export const RENTED_DETAILS: ApiStatusDetail[] = [{ label: 'Created', value: '2025-11-20' }];

export const RENTED_NOTE =
  "This is a rented API key managed by GigRadar, not your personal one. But don't worry it works just like yours. For full control, connect your own API key.";
