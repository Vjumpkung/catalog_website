import client from "@/api/client";
import UserLayout from "@/components/UserLayout";
import { addressSchema, settingsSchema } from "@/types/swagger.types";
import apiCheck from "@/utils/apicheck";
import { getProfile } from "@/utils/profile";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
} from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ManageAddress({
  settings,
  profile,
  addresses_res,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [addresses, setAddresses] = useState<addressSchema[] | undefined>(
    addresses_res
  );
  const token = getCookie("shopping-jwt") as string | null;
  const router = useRouter();

  async function create_address() {
    const { data, error, response } = await client.POST("/api/v1/addresses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        title: "ชื่อผู้รับ",
        telephone: "0000000000",
        address: "ที่อยู่ใหม่",
        default: false,
      },
    });

    if (response.status !== 201) {
      toast.error("เกิดข้อผิดพลาดในการสร้างที่อยู่ใหม่", {
        position: "bottom-right",
      });
      return;
    }

    router.push(`/address/edit?id=${data?._id}`);
  }

  return (
    <UserLayout settings={settings} profile={profile}>
      <title>{`${settings?.name} - ที่อยู่ของฉัน`}</title>
      <div className="container lg:w-1/2 w-full mx-auto px-5">
        <h2 className="text-2xl font-bold">ที่อยู่ของฉัน</h2>
        {addresses?.map((address) => {
          return (
            <div key={address._id} className="py-2">
              <Card className="w-full mx-auto px-1">
                <CardHeader className="flex flex-row">
                  <div className="flex-grow">
                    <p className="text-xl">
                      {address.title}{" "}
                      <span className="text-gray-500 font-extralight mx-2">
                        |
                      </span>{" "}
                      {address.telephone}
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="flex flex-col">
                  <div className="">
                    <p>{address.address}</p>
                  </div>
                  <div className="pt-1">
                    {address.default ? (
                      <Chip color="primary">ที่อยู่เริ่มต้น</Chip>
                    ) : null}
                  </div>
                </CardBody>
                <CardFooter className="flex flex-row justify-end">
                  <div className="flex flex-row justify-end">
                    <Button
                      className="text-lg"
                      onClick={() =>
                        router.push(`/address/edit?id=${address._id}`)
                      }
                    >
                      แก้ไข
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          );
        })}
        <div className="flex flex-col justify-center">
          <div className="self-center">
            <Button color="primary" onClick={() => create_address()}>
              เพิ่มที่อยู่
            </Button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export async function getServerSideProps({ req, res }: any) {
  if (await apiCheck()) {
    return { redirect: { destination: "/500", permanent: false } };
  }
  const { data } = await client.GET("/api/v1/settings");

  const settings = data as settingsSchema;

  const shopping_jwt = getCookie("shopping-jwt", { req, res }) as string | null;

  const profile = await getProfile(shopping_jwt);

  const addresses = await client.GET("/api/v1/addresses", {
    headers: {
      Authorization: `Bearer ${shopping_jwt}`,
    },
  });

  if (shopping_jwt) {
    return {
      props: {
        settings,
        profile,
        addresses_res: addresses.data as addressSchema[],
      },
    };
  } else {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
}
