export type FieldErrors<T> = Partial<Record<keyof T, string[]>>;

export type ActionResult<T = unknown> =
  | { ok: true }
  | { ok: false; code: string; fieldErrors?: FieldErrors<T> };

export const ok = (): ActionResult<never> => ({ ok: true });

export const fail = <T = never>(code: string, fieldErrors?: FieldErrors<T>): ActionResult<T> => ({
  ok: false,
  code,
  fieldErrors,
});

// Стабільні коди помилок — локалізований текст підставляє клієнт зі словника
export const ACTION_ERROR = {
  validation: "validation",
  serverError: "serverError",
  invalidCredentials: "invalidCredentials",
} as const;
