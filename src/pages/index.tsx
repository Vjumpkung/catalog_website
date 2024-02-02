import client from "@/api/client";
import { jwt_token } from "@/utils/config";
import UserLayout from "@/components/UserLayout";
import { placeholder } from "@/const/placeholder";
import {
  ProductAllResponseDto,
  ChoiceResponseDto,
  GetSettingsDto,
} from "@/types/swagger.types";
import apiCheck from "@/utils/apicheck";
import { getProfile } from "@/utils/profile";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import NextImage from "next/image";
import Link from "next/link";
import isURL from "validator/lib/isURL";

export type rangePrice = {
  min_price: number;
  max_price: number;
};

export class priceRange {
  constructor(public min_price: number, public max_price: number) {
    this.min_price = min_price;
    this.max_price = max_price;
  }
}

export function calculatedChoicePrice(
  choices: ChoiceResponseDto[]
): rangePrice {
  const min_price = Math.min(...choices.map((choice) => choice.price));
  const max_price = Math.max(...choices.map((choice) => choice.price));
  return new priceRange(min_price, max_price);
}

async function fetchProduct() {
  const res = await client.GET("/products/", {
    params: {
      query: {
        status: "published",
      },
    },
  });

  return res;
}

export default function Home({
  products,
  settings,
  profile,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <UserLayout settings={settings} profile={profile}>
      <main>
        <Head>
          <title>{`${settings?.name} - หน้าแรก`}</title>
        </Head>
        <div className="w-5/6 mx-auto">
          <div className="flex flex-wrap justify-center">
            {products?.map((product) => {
              const price_range =
                product.choices?.length > 0
                  ? calculatedChoicePrice(product.choices)
                  : new priceRange(0, 0);
              return (
                <div key={product.id} className="">
                  <Link href={`/product/${product.id}`} key={product.id}>
                    <div key={product.id} className="my-2 mx-2 w-72">
                      <Card className="py-2">
                        <CardHeader className="pb-0 pt-2 px-4">
                          {product.images?.length > 0 ? (
                            <div className="mx-auto">
                              <Image
                                className="object-scale-down max-h-52 h-full aspect-square"
                                as={NextImage}
                                radius="none"
                                src={
                                  isURL(product.images[0])
                                    ? product.images[0]
                                    : placeholder
                                }
                                alt={"รูปภาพนั่นแหล่ะ"}
                                width={200}
                                height={200}
                              />
                            </div>
                          ) : (
                            <div className="mx-auto">
                              <Image
                                className="object-scale-down max-h-52 h-full aspect-square"
                                src={placeholder}
                                width={200}
                                height={200}
                                alt={"รูปภาพนั่นแหล่ะ"}
                              />
                            </div>
                          )}
                        </CardHeader>
                        <CardBody className="overflow-hidden py-2">
                          <h4 className=" font-medium text-large truncate">
                            {product.name}
                          </h4>
                          <p className="text-medium">
                            {product.choices?.length > 0
                              ? `${price_range.min_price.toLocaleString()} - ${price_range.max_price.toLocaleString()}`
                              : product.price.toLocaleString()}{" "}
                            บาท
                          </p>
                        </CardBody>
                      </Card>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </UserLayout>
  );
}

export async function getServerSideProps({ req, res }: { req: any; res: any }) {
  if (await apiCheck()) {
    return { redirect: { destination: "/500", permanent: false } };
  }

  const { data } = await client.GET("/settings/");
  const fetchProducts = await fetchProduct();
  const products = fetchProducts.data as ProductAllResponseDto | undefined;
  const settings = data as GetSettingsDto;
  const shopping_jwt = getCookie(jwt_token, { req, res }) as string | null;
  const profile = await getProfile(shopping_jwt);

  return {
    props: {
      products,
      settings,
      profile,
    },
  };
}
