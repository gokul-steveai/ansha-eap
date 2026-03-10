import AppBreadCrumb from "@/components/breadCrumb/appBreadCrumb";
import { ReactNode } from "react";


export type LayoutWithChildrenProps = {
    children: ReactNode;
}

const LayoutWithBreadcrumb = ({children}:LayoutWithChildrenProps) => {
    return (
      <>
        <AppBreadCrumb />
        {children}
      </>
    );
}

export default LayoutWithBreadcrumb;