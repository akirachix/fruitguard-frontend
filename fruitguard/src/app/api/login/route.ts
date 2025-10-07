const baseUrl = process.env.BASE_URL;

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return new Response("Missing required values: email, password", {
      status: 400,
    });
  }

  try {
    const response = await fetch(`${baseUrl}/login/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(errorText || "Login failed", { status: response.status });
    }

    const result = await response.json();

    const responseData = {
      token: result.token,
      user_type: result.user_type,
      email: result.email,
      first_name: result.first_name,
      last_name: result.last_name,
      user_id: result.user_id,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
    });
  }
}