import client from "@/api/client";

export const useRegister = () => {
  const register = async (username: string, password: string) => {
    const { data, error, response } = await client.POST("/auth/register", {
      body: {
        username: username,
        password: password,
      },
    });

    if (response.status === 400) {
      throw new Error();
    }
    return true;
  };
  return { register };
};
