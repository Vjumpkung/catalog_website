import client from "@/api/client";
import { jwt_token } from "@/utils/config";
import LightBox from "@/components/LightBox";
import ShoppingCartIcon from "@/components/ShoppingCart";
import UserLayout from "@/components/UserLayout";
import { placeholder } from "@/const/placeholder";
import { ProductResponseDto, GetSettingsDto } from "@/types/swagger.types";
import useWindowDimensions from "@/utils/checkviewport";
import { getProfile } from "@/utils/profile";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Divider,
  Image,
  Textarea,
} from "@nextui-org/react";
import { getCookie } from "cookies-next";
import "github-markdown-css/github-markdown-light.css";
import "highlight.js/styles/github.css";
import { InferGetServerSidePropsType } from "next";
import NextImage from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createRef, useRef, useState } from "react";
import { CaretLeftFill, CaretRightFill } from "react-bootstrap-icons";
import Markdown from "react-markdown";
import { toast } from "react-toastify";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import emoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import { isURL } from "validator";
import { calculatedChoicePrice, priceRange } from "..";
import Head from "next/head";
import apiCheck from "@/utils/apicheck";

export default function Product({
  product,
  settings,
  profile,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  let { width, height } = useWindowDimensions();
  const elementRef = useRef(null);
  const imageRef = useRef<any[]>([]);
  imageRef.current = product.images?.map(
    (element, i) => imageRef.current[i] ?? createRef()
  );
  const token = getCookie(jwt_token) as string | null;
  const [price, SetPrice] = useState<number>(-1);
  const [quantity, SetQuantity] = useState<number>(0);
  const [selectedChoice, SetSelectedChoice] = useState<string>("");
  const [selectedImage, SetSelectedImage] = useState<string>(
    product.images?.length > 0 ? product.images[0] : ""
  );
  const [addinfo, SetAddinfo] = useState<string>("");

  const [openLightBox, setOpenLightBox] = useState<boolean>(false);

  const path = usePathname();

  const price_range =
    product.choices.length > 0
      ? calculatedChoicePrice(product.choices)
      : new priceRange(0, 0);

  const handleHorizontalScroll = (
    element: any,
    speed: number,
    distance: number,
    step: number
  ) => {
    let scrollAmount = 0;
    const slideTimer = setInterval(() => {
      element.scrollLeft += step;
      scrollAmount += Math.abs(step);
      if (scrollAmount >= distance) {
        clearInterval(slideTimer);
      }
    }, speed);
  };

  return (
    <UserLayout settings={settings} profile={profile}>
      <Head>
        <title>{`${settings?.name} - ${product.name}`}</title>
      </Head>
      <div className="w-full sm:w-4/6 mx-auto">
        <Breadcrumbs className="sm:block hidden">
          <BreadcrumbItem key={12345} isDisabled>
            {settings?.name}
          </BreadcrumbItem>
          {path
            .split("/")
            .filter((item) => item !== "")
            .map((item, index) => {
              const url = item === "product" ? "/" : item;
              item = item === product.id ? product.name : item;
              return (
                <BreadcrumbItem
                  key={index.toString() + Math.random().toString()}
                >
                  <Link
                    href={url}
                    className=" overflow-hidden max-w-48 truncate"
                  >
                    {item}
                  </Link>
                </BreadcrumbItem>
              );
            })}
        </Breadcrumbs>
        <div className="grid xl:grid-cols-2">
          <div className="px-3 py-4 mx-auto max-w-[480px]">
            {product.images?.length > 0 ? (
              <>
                <div className="mx-auto relative aspect-square border border-gray-200">
                  <LightBox
                    images={product.images}
                    display={openLightBox}
                    selectImage={selectedImage}
                    stateChanger={setOpenLightBox}
                  />
                  <div className="xl:block hidden">
                    {product.images.map((image, index) => {
                      return (
                        <div
                          key={isURL(image) ? image : placeholder}
                          className={` ${
                            selectedImage === image ? "block" : "hidden"
                          }`}
                        >
                          <button
                            key={
                              isURL(image)
                                ? image
                                : placeholder + index.toString()
                            }
                            onClick={() => {
                              setOpenLightBox(!openLightBox);
                            }}
                          >
                            <Image
                              className="object-contain my-auto h-full aspect-square"
                              as={NextImage}
                              src={isURL(image) ? image : placeholder}
                              alt={"รูปภาพนั่นแหล่ะ"}
                              radius="none"
                              width={480}
                              height={480}
                              quality={100}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="xl:hidden snap-x snap-mandatory overflow-x-auto flex flex-nowrap no-scrollbar">
                    {product.images.map((image, index) => {
                      return (
                        <div
                          key={
                            isURL(image)
                              ? image
                              : placeholder + index.toString()
                          }
                          className="snap-center snap-always w-full flex-none"
                          ref={imageRef.current[index]}
                        >
                          <Image
                            className="object-contain my-auto h-full aspect-square"
                            as={NextImage}
                            src={isURL(image) ? image : placeholder}
                            alt={"รูปภาพนั่นแหล่ะ"}
                            width={480}
                            height={480}
                            quality={100}
                            radius="none"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-row justify-center">
                  <div className="self-center xl:block hidden">
                    <button
                      onClick={() => {
                        handleHorizontalScroll(elementRef.current, 1, 100, -5);
                      }}
                    >
                      <CaretLeftFill />
                    </button>
                  </div>
                  <div
                    className="flex flex-row my-5 overflow-x-auto gap-2 no-scrollbar"
                    ref={elementRef}
                  >
                    {product.images.map((image, index) => {
                      return (
                        <div className="flex-none aspect-square" key={image}>
                          <button
                            onMouseOver={() => SetSelectedImage(image)}
                            onClick={() => {
                              if (width >= 1280) {
                                setOpenLightBox(!openLightBox);
                              } else {
                                imageRef.current[
                                  index
                                ]?.current?.scrollIntoView({
                                  block: "center",
                                  inline: "center",
                                });
                              }
                            }}
                          >
                            <Image
                              className={`border object-scale-down w-20 h-20 ${
                                selectedImage ===
                                (isURL(image) ? image : placeholder)
                                  ? "border-gray-400"
                                  : "border-gray-300"
                              }`}
                              as={NextImage}
                              src={isURL(image) ? image : placeholder}
                              alt={"รูปภาพนั่นแหล่ะ"}
                              radius="none"
                              width={80}
                              height={80}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="self-center xl:block hidden">
                    <button
                      onClick={() => {
                        handleHorizontalScroll(elementRef.current, 1, 100, +5);
                      }}
                    >
                      <CaretRightFill />
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
          <div className="px-3 py-4">
            <h1 className="font-medium text-left text-2xl">{product.name}</h1>
            <Divider />
            <div className="py-6">
              {price !== -1 ? (
                <p className="text-3xl font-medium text-left">
                  {price.toLocaleString()} บาท
                </p>
              ) : (
                <p className="text-3xl font-medium text-left">
                  {product.choices.length > 0
                    ? `${price_range.min_price.toLocaleString()} - ${price_range.max_price.toLocaleString()}`
                    : product.price?.toLocaleString()}{" "}
                  บาท
                </p>
              )}
            </div>
            {product.choices.length > 0 ? (
              <h2 className="text-xl">ตัวเลือก</h2>
            ) : null}
            <div className="flex flex-wrap">
              {product.choices.length > 0
                ? product.choices.map((choice) => {
                    return (
                      <div className="my-2 pr-2" key={choice.id}>
                        <Button
                          radius="sm"
                          onClick={() => {
                            SetPrice(choice.price);
                            SetSelectedChoice(choice.id);
                          }}
                          className={
                            selectedChoice === choice.id
                              ? `bg-gray-600 text-white`
                              : ``
                          }
                        >
                          <p>{choice.name}</p>
                        </Button>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        </div>
        <Divider />
        <div className="grid grid-cols-1 py-8 px-2">
          <div>
            <h2 className="text-xl font-bold">รายละเอียด</h2>
            <div className="prose all-initial">
              <div className="markdown-body">
                <Markdown
                  rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
                  remarkPlugins={[remarkGfm, remarkToc, emoji]}
                >
                  {product.description}
                </Markdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export const getServerSideProps = async (context: any) => {
  if (await apiCheck()) {
    return { redirect: { destination: "/500", permanent: false } };
  }

  const { data, error, response } = await client.GET("/products/{id}", {
    params: {
      path: {
        id: context.params.id as string,
      },
    },
  });

  const get_settings = await client.GET("/settings/");

  const shopping_jwt = getCookie(jwt_token, {
    req: context.req,
    res: context.res,
  }) as string | null;
  const profile = await getProfile(shopping_jwt);

  if (error) {
    return {
      notFound: true,
    };
  }

  const product: ProductResponseDto = data;
  const settings: GetSettingsDto = get_settings.data as GetSettingsDto;

  return {
    props: {
      product,
      settings,
      profile,
    },
  };
};
