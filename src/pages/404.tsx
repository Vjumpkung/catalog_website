import { Button } from "@nextui-org/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="left-0 right-0 top-0 bottom-0 flex min-h-screen flex-col items-center justify-between -z-10">
      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-xl m-auto px-2">
        <h1 className="text-3xl">ไม่พบเนื้อหา</h1>
        <small>404 not found</small>
        <Link href="/">
          <Button>กลับสู่หน้าแรก</Button>
        </Link>
      </div>
    </div>
  );
}
