"use client"
import { LogoutUser } from "@/serverActions/login_logout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
    const router = useRouter();
    useEffect(()=>{
        LogoutUser()
        .then(res => {
            console.log(res)
            router.push("/login")
        })
    },[router])
 
    
    return (
        <div>
            Logging out...
        </div>
    );
}