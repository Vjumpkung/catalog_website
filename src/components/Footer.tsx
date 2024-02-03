import { GetSettingsDto } from "@/types/swagger.types";
import { useRouter } from "next/router";

export default function Footer({ settings }: { settings: GetSettingsDto }) {
  const router = useRouter();

  if (router.pathname === "/signin" || router.pathname === "/signup")
    return null;
  return (
    <footer className="mt-5 mb-2">
      <div>
        <p className="text-center  text-gray-400">{settings.name}</p>
      </div>
    </footer>
  );
}
