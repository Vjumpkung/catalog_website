import client from "@/api/client";
import { jwt_token } from "@/utils/config";
import AdminLayout from "@/components/AdminLayout";
import { EyeFilledIcon } from "@/components/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/EyeSlashFilledIcon";
import {
  CreateUserDto,
  GetSettingsDto,
  UserResponseDto,
} from "@/types/swagger.types";
import apiCheck from "@/utils/apicheck";
import { getProfile } from "@/utils/profile";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { PencilSquare, TrashFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";

export default function ManageAccounts({
  settings,
  profile,
  allUsers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const token = getCookie(jwt_token);
  const [users, setUsers] = useState<UserResponseDto>(allUsers);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectRole, setSelectRole] = useState<string>("");
  const [isEditRoleOpen, setIsEditRoleOpen] = useState<boolean>(false);
  const [createUser, setCreateUser] = useState<CreateUserDto>({
    username: "",
    password: "",
  });
  const [isUsernameError, setIsUsernameError] = useState<string>("");
  const [isPasswordError, setIsPasswordError] = useState<string>("");
  const [toggleVisibility, setToggleVisibility] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function onDelete(id: string) {
    client
      .DELETE("/users/{id}", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          path: {
            id: id,
          },
        },
      })
      .then(() => {
        client
          .GET("/users/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setUsers(res.data as UserResponseDto);
          });
        toast.success("ลบบัญชีผู้ใช้เรียบร้อยแล้ว", {
          position: "bottom-right",
        });
      })
      .catch((err) => {
        toast.error("เกิดข้อผิดพลาดบางอย่าง", {
          position: "bottom-right",
        });
      });
  }

  function onCreate(createUserDto: CreateUserDto) {
    if (createUserDto.username === "") {
      setIsUsernameError("กรุณากรอกชื่อผู้ใช้");
      return;
    } else {
      setIsUsernameError("");
    }
    if (createUserDto.password === "") {
      setIsPasswordError("กรุณากรอกรหัสผ่าน");
      return;
    } else {
      setIsPasswordError("");
    }
    client
      .POST("/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: createUserDto,
      })
      .then((res) => {
        if (res.response.status === 400) {
          setIsUsernameError("ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว");
          return;
        }
        if (res.response.status === 204) {
          client
            .GET("/users/", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              setUsers(res.data as UserResponseDto);
            });
          toast.success("เพิ่มผู้ใช้เรียบร้อยแล้ว", {
            position: "bottom-right",
          });
          onOpenChange();
          return;
        }
      })
      .catch(() => {
        toast.error("เกิดข้อผิดพลาดบางอย่าง", {
          position: "bottom-right",
        });
      });
  }

  return (
    <AdminLayout settings={settings}>
      <title>{`${settings.name} - จัดการบัญชีทั้งหมด`}</title>
      <main>
        <div className="flex flex-row">
          <div>
            <p className="text-2xl font-semibold">จัดการบัญชีทั้งหมด</p>
          </div>
          <div className="ml-auto">
            <Button onPress={onOpenChange}>เพิ่มผู้ใช้ใหม่</Button>
            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              onClose={() => {
                setIsUsernameError("");
                setIsPasswordError("");
                setCreateUser({
                  username: "",
                  password: "",
                });
              }}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      เพิ่มผู้ใช้ใหม่
                    </ModalHeader>
                    <ModalBody>
                      <Input
                        autoFocus
                        isInvalid={isUsernameError !== ""}
                        errorMessage={isUsernameError}
                        value={createUser.username}
                        onChange={(e) => {
                          setCreateUser({
                            ...createUser,
                            username: e.target.value,
                          });
                        }}
                        label="ชื่อผู้ใช้"
                        placeholder="กรอกชื่อผู้ใช้"
                        variant="bordered"
                      />
                      <Input
                        label="รหัสผ่าน"
                        isInvalid={isPasswordError !== ""}
                        errorMessage={isPasswordError}
                        value={createUser.password}
                        onChange={(e) => {
                          setCreateUser({
                            ...createUser,
                            password: e.target.value,
                          });
                        }}
                        placeholder="กรอกรหัสผ่าน"
                        type={toggleVisibility ? "text" : "password"}
                        variant="bordered"
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={() =>
                              setToggleVisibility(!toggleVisibility)
                            }
                          >
                            {toggleVisibility ? (
                              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                          </button>
                        }
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="danger"
                        variant="light"
                        onPress={() => {
                          onClose();
                          setCreateUser({
                            username: "",
                            password: "",
                          });
                        }}
                      >
                        ยกเลิก
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => {
                          onCreate(createUser);
                        }}
                      >
                        เพิ่ม
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </div>
        <div className="mt-4">
          <Table aria-label="all products">
            <TableHeader>
              <TableColumn>ชื่อผู้ใช้</TableColumn>
              <TableColumn>ลบ</TableColumn>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                if (user.id === profile?.id) {
                  return (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell width={100}>
                        <button disabled={user.id === profile.id}>
                          <TrashFill
                            className={`mt-1 ${
                              user.id === profile.id
                                ? "text-red-300"
                                : "text-red-500"
                            }`}
                          />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                } else {
                  return (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell width={20}>
                        <Popover placement="bottom-end" color="default">
                          <PopoverTrigger>
                            <button disabled={user.id === profile?.id}>
                              <TrashFill
                                className={`mt-1 ${
                                  user.id === profile?.id
                                    ? "text-red-300"
                                    : "text-red-500"
                                }`}
                              />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="flex flex-col gap-2 mt-2 px-3">
                              <div>
                                <p>คุณต้องการลบผู้ใช้นี้ใช่หรือไม่</p>
                              </div>
                              <div className="self-center pb-2">
                                <Button
                                  size="sm"
                                  color="danger"
                                  onClick={() => {
                                    onDelete(user.id);
                                  }}
                                >
                                  ลบผู้ใช้
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
            </TableBody>
          </Table>
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

  const profile = await getProfile(shopping_jwt);

  const allUsers = (
    await client.GET("/users/", {
      headers: {
        Authorization: `Bearer ${shopping_jwt}`,
      },
    })
  ).data as UserResponseDto;

  if (shopping_jwt) {
    return {
      props: {
        settings,
        allUsers,
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
