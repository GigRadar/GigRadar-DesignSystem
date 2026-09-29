import { useEffect } from 'react';

/**
 * The build tool's flag, where there is one. Vite, webpack and Next replace the
 * literal `process.env.NODE_ENV` at build time; where nothing replaces it and
 * there is no `process`, reading it throws, which counts as development.
 */
declare const process: { env: { NODE_ENV?: string } };

function isProduction(): boolean {
  try {
    return process.env.NODE_ENV === 'production';
  } catch {
    return false;
  }
}

const warned = new Set<string>();

/**
 * Says once, in the console, that a component is still in development.
 *
 * A component can be published before its design is signed off — so apps can
 * start building against it — and the gallery's In development badge does not
 * reach anyone reading the app's code. This does: one warning per component per
 * page load, never in a production build.
 */
export function useInDevelopmentWarning(name: string, ticket: string): void {
  useEffect(() => {
    if (warned.has(name) || isProduction()) return;
    warned.add(name);
    console.warn(
      `[@gigradar/ui] ${name} is in development (${ticket}). Its design is not signed off yet, so its props and look may change in a minor release. See the gallery's review list before relying on it.`,
    );
  }, [name, ticket]);
}
