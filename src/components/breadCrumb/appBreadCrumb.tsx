import { isMobileUA } from "@/lib/isMobileUa";
import Breadcrumb from "../ui/breadcrumb";

const AppBreadCrumb = async () => {
const isMobile = await isMobileUA();
  return isMobile ?  <></> : <Breadcrumb />;
}

export default AppBreadCrumb;