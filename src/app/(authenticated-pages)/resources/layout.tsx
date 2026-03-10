import LayoutWithBreadcrumb, {
  LayoutWithChildrenProps,
} from "@/components/layouts/layoutWIthBreadCrumb";
import { UserActivityProvider } from "@/context/userActivitiesContext";

const Layout = ({ children }: LayoutWithChildrenProps) => {
  return (
    <UserActivityProvider>
      <LayoutWithBreadcrumb>{children}</LayoutWithBreadcrumb>
    </UserActivityProvider>
  );
};

export default Layout;
