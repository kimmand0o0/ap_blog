import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PostOrder () {
    return (
    <div className="w-full p-2 flex flex-row justify-end items-center">
        <Button variant="ghost">
            <Link href={`/?orderBy=createdAt`}>작성일순</Link></Button>
        <div className="border-r-[1.8px] h-4"/>
        <Button variant="ghost">
            <Link href={`/?orderBy=updatedAt`}>수정일순</Link>
        </Button>
    </div>
    )
}