import client from "@/api/client";
import UserLayout from "@/components/UserLayout";
import { CartResponseDto, settingsSchema } from "@/types/swagger.types";
import apiCheck from "@/utils/apicheck";
import { getProfile } from "@/utils/profile";
import { Button, Card, CardHeader, Checkbox } from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Cart({
  settings,
  profile,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [willOrder, setWillOrder] = useState<string[]>([]);
  const [cart, setCart] = useState<CartResponseDto[] | undefined>([]);
  const [trigger, setTrigger] = useState<boolean>(false);
  const token = getCookie("shopping-jwt") as string | null;
  const router = useRouter();

  useEffect(() => {
    if (token !== null) {
      client
        .GET("/api/v1/shopping-cart/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setCart(res.data);
        });
    } else {
      router.push("/signin");
    }
  }, [trigger, router]);

  async function removeItemFromCart(id: string) {
    await client.DELETE("/api/v1/shopping-cart/remove", {
      params: {
        query: {
          cart_id: id,
        },
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.warning("ลบสินค้าออกจากตะกร้าแล้ว", { position: "bottom-right" });
    setTrigger(!trigger);
  }

  return (
    <UserLayout settings={settings} profile={profile}>
      <Head>
        <title>{settings?.name + " - ตะกร้าของฉัน"}</title>
      </Head>
      <div className="container lg:w-1/2 w-full mx-auto px-5">
        <h2 className="text-3xl">ตะกร้าของฉัน</h2>
        <div className="grid grid-cols-1">
          {cart?.map((item) => {
            return (
              <div key={item._id} className="py-2">
                <Card className="w-full mx-auto px-1">
                  <CardHeader className="flex flex-row">
                    <div className="flex">
                      <Checkbox
                        size="lg"
                        className="py-1 pt-2"
                        onChange={() => {
                          willOrder.includes(item._id)
                            ? willOrder.splice(willOrder.indexOf(item._id), 1)
                            : willOrder.push(item._id);
                          setWillOrder([...willOrder]);
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <div>
                        <Link href={`/product/${item.product._id}`}>
                          <Image
                            src={item.product.image[0]}
                            width={80}
                            height={80}
                            alt={"รูปภาพนั่นแหล่ะ"}
                            className="object-cover h-auto"
                          />
                        </Link>
                      </div>
                      <div className="pt-2">
                        <Link href={`/product/${item.product._id}`}>
                          <p className="text-xl">{item.product.name}</p>
                        </Link>
                        {item.choice ? (
                          <p className="text-gray-500">
                            <span className="font-medium">ตัวเลือก</span> :{" "}
                            {item.choice.name}
                          </p>
                        ) : null}
                        <p className="text-gray-500">
                          <span className="font-medium">ราคา</span> :{" "}
                          {item.choice
                            ? item.choice.price.toLocaleString()
                            : item.product.price.toLocaleString()}{" "}
                          บาท{" "}
                        </p>
                        <p>x{item.amount}</p>
                        {item.additional_info ? (
                          <p>ข้อมูลเพิ่มเติม : {item.additional_info}</p>
                        ) : null}
                        <p className="text-2xl">
                          {item.total_price.toLocaleString()} บาท
                        </p>
                      </div>
                    </div>
                    <div className="flex-none">
                      <button
                        onClick={() => {
                          willOrder.splice(willOrder.indexOf(item._id), 1);
                          setWillOrder([...willOrder]);
                          removeItemFromCart(item._id);
                        }}
                      >
                        <Image
                          src={`/trash.svg`}
                          width={40}
                          height={40}
                          alt="trash icon"
                        />
                      </button>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            );
          })}
          <div
            className={`mx-auto ${
              willOrder.length > 0 ? "block" : "hidden"
            } py-3`}
          >
            <Button
              size="lg"
              color="primary"
              onClick={() =>
                router.push(`/checkout?cart=${willOrder.join(",")}`)
              }
            >
              ชำระเงิน
            </Button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export async function getServerSideProps({ req, res }: { req: any; res: any }) {
  if (await apiCheck()) {
    return { redirect: { destination: "/500", permanent: false } };
  }

  const { data } = await client.GET("/api/v1/settings");

  const settings = data as settingsSchema;

  const shopping_jwt = getCookie("shopping-jwt", { req, res }) as string | null;

  const profile = await getProfile(shopping_jwt);

  if (shopping_jwt) {
    return {
      props: {
        settings,
        profile,
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
