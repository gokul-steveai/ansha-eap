import { ReactNode } from "react";
import AppBreadCrumb from "../breadCrumb/appBreadCrumb";

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