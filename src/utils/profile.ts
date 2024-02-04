import client from "@/api/client";

export async function getProfile(token: string | null) {
  if (!token) {
    return null;
  }

  const { data, error } = await client.GET("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}
