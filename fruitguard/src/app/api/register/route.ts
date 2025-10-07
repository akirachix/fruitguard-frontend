const baseUrl = process.env.BASE_URL;
export async function POST(request: Request) {
  const body = await request.json();
  const { first_name, last_name, email, phone_number, password } = body;
  if (!first_name || !last_name || !email || !phone_number ||!password) {
    return new Response("Missing required values: first_name, last_name, email, phone_number, password", {
      status: 400
    })};
  try {
    const response = await fetch(`${baseUrl}/register/`, {
      method: 'POST',
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ first_name, last_name, email, phone_number, password }),
    })
    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 201,
      statusText: "User created successfully",
    })
  } catch (error) {
    return new Response((error as Error).message, {
      status: 500
    })}};




