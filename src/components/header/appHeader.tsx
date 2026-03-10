import { isMobileUA } from "@/lib/isMobileUa";
import MainHeaderMobile from "./mainHeaderMobile";
import MainHeader from "../ui/mainHeader";



export default async function AppHeader() {
  const isMobile = await isMobileUA();
  return isMobile ?  <MainHeaderMobile /> : <MainHeader />;
}
