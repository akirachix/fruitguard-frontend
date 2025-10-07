"use client";

import { useState } from "react";
import { fetchLogin } from "../utils/fetchLogin";

export default function useFetchLogin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchLogin(email, password);
      setLoading(false);
      return result;
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
      return null;
    }}
  return { login, loading, error };
}