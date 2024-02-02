import { GetSettingsDto } from "@/types/swagger.types";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { deleteCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import {
  Bag,
  BoxArrowRight,
  CaretLeftFill,
  CaretRightFill,
  CheckCircle,
  FileEarmarkPerson,
  Gear,
  Person,
  Shop,
} from "react-bootstrap-icons";
import { AdminMenuContext } from "./AdminLayout";
import { jwt_token } from "@/utils/config";

export default function AdminHeader({
  settings,
}: {
  settings: GetSettingsDto;
}) {
  const { isOpen, setIsOpen } = useContext(AdminMenuContext);

  const router = useRouter();

  const adminPath = router.pathname.split("/")[2];

  return (
    <div
      className={`rounded-md flex ${
        isOpen ? "flex-row" : "flex-col"
      } ml-5 my-5 px-2 py-2 bg-white max-w-xs flex-none`}
    >
      <div className={`flex-grow ${isOpen ? "block" : "hidden"}`}>
        <Link href="/" prefetch={false}>
          <div className="flex flex-row ">
            <div className="mx-2 mt-2 flex-none">
              <Image
                src={settings.logo}
                width={32}
                height={32}
                alt="logo"
                className="aspect-square object-cover"
              />
            </div>
            <div className="flex-1 max-w-[213px] min-w-[213px] mt-3 mr-4 truncate overflow-hidden">
              <p className="text-xl">{settings.name}</p>
            </div>
          </div>
        </Link>
        <Listbox
          aria-label="admin menu"
          className="py-4"
          itemClasses={{
            base: "px-3 rounded-lg gap-3 h-12 data-[hover=true]:bg-gray-200 text-gray-600",
          }}
          onAction={(item) => {
            if (item !== "logout") {
              router.push(`/admin/${item}`);
            } else {
              deleteCookie(jwt_token);
              router.push(`/signin`);
            }
          }}
        >
          <ListboxItem
            className={`${
              adminPath === "products" && " bg-gray-200 text-black"
            }`}
            startContent={<Bag />}
            key="products"
          >
            จัดการสินค้า
          </ListboxItem>
          <ListboxItem
            className={`${
              adminPath === "choices" && " bg-gray-200 text-black"
            }`}
            startContent={<CheckCircle />}
            key="choices"
          >
            จัดการตัวเลือกสินค้า
          </ListboxItem>
          <ListboxItem
            className={`${
              adminPath === "manage_accounts" && " bg-gray-200 text-black"
            }`}
            startContent={<FileEarmarkPerson />}
            key="manage_accounts"
          >
            จัดการบัญชีทั้งหมด
          </ListboxItem>
          <ListboxItem
            className={`${
              adminPath === "manage_personal_account" &&
              " bg-gray-200 text-black"
            }`}
            startContent={<Person />}
            key="manage_personal_account"
          >
            จัดการบัญชีส่วนตัว
          </ListboxItem>
          <ListboxItem
            className={`${
              adminPath === "shop_settings" && " bg-gray-200 text-black"
            }`}
            startContent={<Gear />}
            key="shop_settings"
          >
            ตั้งค่าร้านค้า
          </ListboxItem>
          <ListboxItem
            className={`${adminPath === "logout" && " bg-gray-200 text-black"}`}
            startContent={<BoxArrowRight />}
            key="logout"
          >
            ออกจากระบบ
          </ListboxItem>
        </Listbox>
      </div>
      <div className={`flex-none ${isOpen ? "hidden" : "block"} mx-auto`}>
        <Link href="/" prefetch={false}>
          <div className="flex flex-row flex-wrap">
            <div className="mx-2 mt-2">
              <Image
                src={settings.logo}
                width={32}
                height={32}
                alt="logo"
                className="aspect-square object-cover"
                quality={100}
              />
            </div>
          </div>
        </Link>
        <Listbox
          aria-label="admin menu"
          className="py-4"
          itemClasses={{
            base: "px-3 rounded-lg gap-3 h-12 data-[hover=true]:bg-gray-200 text-gray-600",
            title: "hidden",
          }}
          onAction={(item) => {
            if (item !== "logout") {
              router.push(`/admin/${item}`);
            } else {
              deleteCookie(jwt_token);
              router.push(`/signin`);
            }
          }}
        >
          <ListboxItem
            className={`${
              adminPath === "products" && " bg-gray-200 text-black"
            }`}
            startContent={<Bag />}
            key="products"
            title="products"
          />
          <ListboxItem
            className={`${
              adminPath === "choices" && " bg-gray-200 text-black"
            }`}
            startContent={<CheckCircle />}
            key="choices"
            title="choices"
          />
          <ListboxItem
            className={`${
              adminPath === "manage_accounts" && " bg-gray-200 text-black"
            }`}
            startContent={<FileEarmarkPerson />}
            key="manage_accounts"
            title="manage_accounts"
          />
          <ListboxItem
            className={`${
              adminPath === "manage_personal_account" &&
              " bg-gray-200 text-black"
            }`}
            startContent={<Person />}
            key="manage_personal_account"
            title="manage_personal_account"
          />
          <ListboxItem
            className={`${
              adminPath === "shop_settings" && " bg-gray-200 text-black"
            }`}
            startContent={<Gear />}
            key="shop_settings"
            title="shop_settings"
          />
          <ListboxItem
            className={`${adminPath === "logout" && " bg-gray-200 text-black"}`}
            startContent={<BoxArrowRight />}
            key="logout"
            title="logout"
          />
        </Listbox>
      </div>

      <div className="w-full max-w-[20px] self-center">
        <button onClick={() => setIsOpen(!isOpen)}>
          <p className="text-center text-xl text-gray-500 transition hover:scale-125 hover:text-black">
            {isOpen ? <CaretLeftFill /> : <CaretRightFill />}
          </p>
        </button>
      </div>
    </div>
  );
}
