/** Tiny class-name joiner (keeps JSX readable without a dependency). */
export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}
