import client from "@/api/client";
import { jwt_token } from "@/utils/config";
import AdminLayout from "@/components/AdminLayout";
import { placeholder } from "@/const/placeholder";
import { ProductAllResponseDto, GetSettingsDto } from "@/types/swagger.types";
import apiCheck from "@/utils/apicheck";
import { getProfile } from "@/utils/profile";
import {
  Button,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { PencilSquare } from "react-bootstrap-icons";
import isURL from "validator/lib/isURL";

export default function AllProducts({
  settings,
  products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [showAll, setShowAll] = useState<boolean>(true);

  return (
    <AdminLayout settings={settings}>
      <Head>
        <title>{`${settings.name} - สินค้าทั้งหมด`}</title>
      </Head>
      <div className="flex flex-row">
        <div>
          <h1 className="text-2xl font-semibold">สินค้าทั้งหมด</h1>
        </div>
        <div className="ml-auto">
          <div className="flex flex-row gap-3">
            <div className="flex flex-row">
              <div className="self-center">
                <span className={`${showAll ? "text-gray-400" : "text-black"}`}>
                  แบบร่าง
                </span>
              </div>
              <Switch
                isSelected={showAll}
                className="ml-2"
                onChange={(e) => {
                  if (e.target.checked) {
                    setShowAll(true);
                  } else {
                    setShowAll(false);
                  }
                }}
              />
              <div className="self-center">
                <span className={`${showAll ? "text-black" : "text-gray-400"}`}>
                  ทั้งหมด
                </span>
              </div>
            </div>
            <div>
              <Button onClick={() => router.push("/admin/products/create")}>
                เพิ่มสินค้า
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Table aria-label="all products">
          <TableHeader>
            <TableColumn>ชื่อสินค้า</TableColumn>
            <TableColumn>รูปภาพ</TableColumn>
            <TableColumn>การเผยแพร่</TableColumn>
            <TableColumn>แก้ไข</TableColumn>
          </TableHeader>
          <TableBody>
            {products
              .sort((a, b) => {
                return (
                  new Date(b.published_at).getTime() -
                  new Date(a.published_at).getTime()
                );
              })
              ?.filter((product) => {
                if (showAll) {
                  return product;
                } else {
                  return product.published_at === null;
                }
              })
              ?.map((product) => {
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="truncate">{product.name}</p>
                      </div>
                    </TableCell>
                    <TableCell width={80}>
                      <Image
                        src={
                          product.images?.length > 0
                            ? isURL(product.images[0])
                              ? product.images[0]
                              : placeholder
                            : placeholder
                        }
                        alt={product.name}
                        width={80}
                        height={80}
                        className="aspect-square object-cover"
                      />
                    </TableCell>
                    <TableCell width={70}>
                      {product.published_at !== null ? "เผยแพร่" : "แบบร่าง"}
                    </TableCell>
                    <TableCell width={20}>
                      <button
                        onClick={() =>
                          router.push(`/admin/products/edit?id=${product.id}`)
                        }
                      >
                        <PencilSquare className="mt-1" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              }) || []}
          </TableBody>
        </Table>
      </div>
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
    const products = await client.GET("/products/", {
      params: {
        query: {
          status: "all",
        },
      },
    });

    return {
      props: {
        settings,
        products: (products.data as ProductAllResponseDto | undefined) || [],
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
