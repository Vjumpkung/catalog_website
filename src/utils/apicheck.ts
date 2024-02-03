import client from "@/api/client";

export default function apiCheck(): Promise<boolean> {
  let x = client
    .GET("/ping")
    .then((res) => {
      return false;
    })
    .catch((err) => {
      console.error(err);
      return true;
    });

  return x;
}
