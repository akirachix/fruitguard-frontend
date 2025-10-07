export async function fetchLogin(email: string, password: string) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Login failed: " + errorText);
  }
  const result = await response.json();
  if (result.token) {
    localStorage.setItem("token", result.token);
  }
  if (result.user_type) {
    localStorage.setItem("user_type", result.user_type);
  }
  return result;
}