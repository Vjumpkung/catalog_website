import { MeResponseDto, GetSettingsDto } from "@/types/swagger.types";
import { jwt_token } from "@/utils/config";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
} from "@nextui-org/react";
import { deleteCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Header({
  settings,
  profile,
}: {
  settings: GetSettingsDto | undefined;
  profile: MeResponseDto | null | undefined;
}) {
  const [isLogin, setIsLogin] = useState<boolean>(profile ? true : false);
  const router = useRouter();

  const me = profile;

  const logout_notify = () =>
    toast.info("คุณได้ออกจากระบบแล้ว", { position: "bottom-right" });

  return (
    <>
      <Navbar>
        <NavbarContent>
          <Link href="/">
            <NavbarBrand>
              <Image
                src={
                  settings
                    ? settings.logo
                    : "https://upload.wikimedia.org/wikipedia/commons/7/70/Solid_white.svg"
                }
                alt="logo"
                width={32}
                height={32}
                className="mx-2 aspect-square object-cover"
              />
              <p className="text-inherit hidden sm:block">{settings?.name}</p>
            </NavbarBrand>
          </Link>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            {isLogin ? (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered={true}
                    name={me?.username[0].toUpperCase()}
                    as="button"
                    className="transition-transform"
                    color="primary"
                    size="sm"
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem
                    key="admin_page"
                    onClick={() => router.push("/admin")}
                  >
                    จัดการหลังบ้าน
                  </DropdownItem>
                  <DropdownItem
                    key="logout-button"
                    color="danger"
                    onClick={() => {
                      logout_notify();
                      deleteCookie(jwt_token);
                      setIsLogin(false);
                      router.push("/");
                    }}
                  >
                    ออกจากระบบ
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Link href={isLogin ? "/profile" : "/signin"} className="hidden">
                <Avatar
                  isBordered={true}
                  showFallback={true}
                  as="button"
                  className="transition-transform"
                  color="default"
                  size="sm"
                />
              </Link>
            )}
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </>
  );
}
