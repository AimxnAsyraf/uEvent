export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

export const ok = <T>(data: T): ActionResult<T> => ({ ok: true, data });

export const fail = (error: string, code?: string): ActionResult<never> =>
  code === undefined ? { ok: false, error } : { ok: false, error, code };
