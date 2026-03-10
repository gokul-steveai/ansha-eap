import { isMobileUA } from "@/lib/isMobileUa";
import Dashboard from "./dashboard";
import DashboardMobile from "./dashboardMobile";

export default async function AppDashboard() {
  const isMobile = await isMobileUA();
  return isMobile ?  <DashboardMobile /> : <Dashboard />;
}