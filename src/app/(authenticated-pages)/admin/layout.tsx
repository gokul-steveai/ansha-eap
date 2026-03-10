"use client"
import { useAppServiceContext } from "@/context/appServiceContext";
import { ElevateAdminContextProvider } from "@/context/ElevateAdminContext";
import { useRouter } from "next/navigation";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const {currentUser} = useAppServiceContext()
    const router = useRouter()
    const hasAdminAccess = ['info@ansahealth.com', 'allaine@aiwebsiteservices.com', 'dev@aiwebsiteservices.com']
    if(!hasAdminAccess.includes(currentUser.email)){
        router.push("/dashboard")
        return
    }
    return <>
        <ElevateAdminContextProvider>
            {children}
        </ElevateAdminContextProvider>
    </>
}