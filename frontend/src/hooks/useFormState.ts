import { useState, type ChangeEvent } from "react";

// ─── Simple form state hook ────────────────────────────────
// This hook manages form state, including input values, loading state, and error messages.
// It provides an onChange handler to update form values and a reset function to clear the form.
// Used in both Login and Sign-Up forms to simplify state management and validation.

export function useFormState<T extends Record<string, string>>(initial: T) {
  const [values, setValues] = useState<T>(initial);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  }

  function reset() {
    setValues(initial);
    setError(null);
    setLoading(false);
  }

  return { values, onChange, error, setError, loading, setLoading, reset };
}
