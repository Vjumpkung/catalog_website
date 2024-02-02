import client from "@/api/client";
import { jwt_token } from "@/utils/config";

export default function apiCheck(): Promise<boolean> {
  let x = client
    .GET("/ping")
    .then((res) => {
      return false;
    })
    .catch((err) => {
      console.log(err);
      return true;
    });

  return x;
}
