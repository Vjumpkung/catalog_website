import client from "@/api/client";
import { jwt_token } from "@/utils/config";
import AdminLayout from "@/components/AdminLayout";
import ProductForm from "@/components/ProductForm";
import {
  ProductResponseDto,
  ProductUpdateDto,
  GetSettingsDto,
} from "@/types/swagger.types";
import apiCheck from "@/utils/apicheck";
import { getProfile } from "@/utils/profile";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

export default function EditProduct({
  settings,
  product_res,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const id = router.query.id;
  const token = getCookie(jwt_token) as string | null;
  const [productEdit, setProductEdit] = useState<ProductUpdateDto | undefined>({
    name: product_res?.name,
    description: product_res?.description,
    price: product_res?.price,
    choices: product_res?.choices.map((choice) => choice.id),
    images: product_res?.images,
  });
  const [published_at, setPublishedAt] = useState<boolean>(
    product_res?.published_at ? true : false
  );

  function onSave() {
    client.PATCH("/products/{id}/update", {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        path: {
          id: id as string,
        },
      },
      body: {
        name: productEdit?.name,
        description: productEdit?.description,
        choices: productEdit?.choices,
        price: productEdit?.price,
        images: productEdit?.images,
      },
    });
    client.PATCH(`/products/{id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        path: {
          id: id as string,
        },
        query: {
          status: published_at,
        },
      },
    });
    toast.success("แก้ไขสินค้าเรียบร้อยแล้ว", { position: "bottom-right" });
    setTimeout(() => {
      router.push("/admin/products");
    }, 500);
  }

  function onDelete() {
    client.DELETE("/products/{id}", {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        path: {
          id: id as string,
        },
      },
    });
    toast.warning("ลบสินค้าเรียบร้อยแล้ว", { position: "bottom-right" });
    setTimeout(() => {
      router.push("/admin/products");
    }, 500);
  }

  return (
    <AdminLayout settings={settings}>
      <Head>
        <title>{`${settings.name} - แก้ไขสินค้า ${productEdit?.name}`}</title>
      </Head>
      <div className="flex flex-row">
        <div className="flex-grow">
          <h1 className="text-2xl font-bold">แก้ไขสินค้า</h1>
        </div>
        <div className="flex-none self-end">
          <Popover placement="bottom-end" color="default">
            <PopoverTrigger>
              <Button size="sm" color="danger" className="mx-1">
                ลบ
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <p>คุณต้องการลบสินค้านี้ใช่หรือไม่</p>
              <div className="flex flex-row gap-2 mt-2">
                <Button
                  size="sm"
                  color="danger"
                  onClick={() => {
                    onDelete();
                  }}
                >
                  ลบสินค้า
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            size="sm"
            color="default"
            className="mx-1"
            onClick={() => router.push("/admin/products")}
          >
            ยกเลิก
          </Button>
          <Button
            size="sm"
            color="primary"
            className="mx-1"
            onClick={() => onSave()}
          >
            ยืนยันการแก้ไข
          </Button>
        </div>
      </div>
      <ProductForm
        product_res={product_res}
        setProductUpdate={setProductEdit}
        setIsPublish={setPublishedAt}
      />
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

  const profile = await getProfile(shopping_jwt);

  if (shopping_jwt) {
    if (ctx.query.id === undefined) {
      return {
        redirect: {
          destination: "/admin/products",
          permanent: false,
        },
      };
    }
    const product = await client.GET("/products/{id}", {
      params: {
        path: {
          id: ctx.query.id as string,
        },
      },
    });
    const product_res = product.data as ProductResponseDto | undefined;

    return {
      props: {
        settings,
        product_res,
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
