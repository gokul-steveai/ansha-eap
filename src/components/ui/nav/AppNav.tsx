import { isMobileUA } from "@/lib/isMobileUa";
import Sidebar from "../../sidebar/sidebar";
import NavMobile from "./NavMobile";


export default async function AppNav() {
  const isMobile = await isMobileUA();
  return isMobile ?  <NavMobile /> : <Sidebar />;
}
