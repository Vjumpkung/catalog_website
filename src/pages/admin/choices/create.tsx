import client from "@/api/client";
import { jwt_token } from "@/utils/config";
import AdminLayout from "@/components/AdminLayout";
import { GetSettingsDto } from "@/types/swagger.types";
import apiCheck from "@/utils/apicheck";
import { getProfile } from "@/utils/profile";
import { Button, Input } from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CreateChoice({
  settings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const [choiceName, setChoiceName] = useState<string>("");
  const [choicePrice, setChoicePrice] = useState<number>(0);

  const token = getCookie(jwt_token) as string | null;

  function onCreate() {
    client
      .POST("/choices/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          name: choiceName,
          price: choicePrice,
        },
      })
      .then(() => {
        toast.success("เพิ่มตัวเลือกเรียบร้อยแล้ว", {
          position: "bottom-right",
        });
        router.push("/admin/choices");
      });
  }

  return (
    <AdminLayout settings={settings}>
      <Head>
        <title>{`${settings.name} - เพิ่มตัวเลือก`}</title>
      </Head>
      <main>
        <div className="flex flex-row">
          <div className="flex-grow">
            <h1 className="text-2xl font-bold">เพิ่มตัวเลือก</h1>
          </div>
          <div className="flex-none self-end">
            <Button
              size="sm"
              color="default"
              className="mx-1"
              onClick={() => router.push("/admin/choices")}
            >
              ยกเลิก
            </Button>
            <Button
              size="sm"
              color="primary"
              className="mx-1"
              onClick={() => onCreate()}
            >
              เพิ่มตัวเลือก
            </Button>
          </div>
        </div>
        <div className="flex flex-col mt-2">
          <div>
            <p className="text-lg">ชื่อตัวเลือก</p>
          </div>
          <div className="flex-grow">
            <Input
              value={choiceName}
              onChange={(e) => setChoiceName(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col mt-2">
          <div>
            <p className="text-lg">ราคา</p>
          </div>
          <div>
            <Input
              value={choicePrice?.toString()}
              type="number"
              onKeyDown={(e) => {
                if (e.key === "." || e.key === "-") {
                  e.preventDefault();
                }
              }}
              min={0}
              max={200000000}
              onChange={(e) => setChoicePrice(Number(e.target.value))}
              endContent="บาท"
            />
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}

export async function getServerSideProps(ctx: any) {
  if (await apiCheck()) {
    return { redirect: { destination: "/500", permanent: false } };
  }
  const { data } = await client.GET("/settings/");

  const settings = data as GetSettingsDto;

  const shopping_jwt = getCookie(jwt_token, {
    req: ctx.req,
    res: ctx.res,
  }) as string | null;

  if (shopping_jwt) {
    return {
      props: {
        settings,
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
