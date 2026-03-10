import LayoutWithBreadcrumb, {
    LayoutWithChildrenProps,
} from "@/components/layouts/layoutWIthBreadCrumb";

const Layout = ({ children }: LayoutWithChildrenProps) => {
  return (
      <LayoutWithBreadcrumb>{children}</LayoutWithBreadcrumb>
  );
};

export default Layout;
