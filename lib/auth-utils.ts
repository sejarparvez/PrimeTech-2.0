export function isAdmin(
  session: { user: { role?: string | null } } | null,
): boolean {
  return session?.user?.role === 'ADMIN';
}
