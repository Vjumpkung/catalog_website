import { MeResponseDto, GetSettingsDto } from "@/types/swagger.types";
import Footer from "./Footer";
import Header from "./Header";

export default function UserLayout({
  children,
  settings,
  profile,
}: {
  children: React.ReactNode;
  settings: GetSettingsDto;
  profile: MeResponseDto | null | undefined;
}) {
  return (
    <>
      <main>
        <Header settings={settings} profile={profile} />
        {children}
        <Footer />
      </main>
    </>
  );
}
