const baseUrl = 'api/profile';

export async function fetchProfile(token: string) {
  try {
    const response = await fetch(baseUrl!, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
      },});
    if (!response.ok) {
       throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }
    return response.json();
   } catch (error) {
   throw new Error("Something went wrong while fetching the profile: " + (error as Error).message);
  }}
