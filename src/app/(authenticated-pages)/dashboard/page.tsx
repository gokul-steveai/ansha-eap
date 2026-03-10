import AppDashboard from "@/components/dashboard/appDashboard";
import InstallPrompt from "@/lib/pwa/InstallPrompt";

const page = () => {
  return (
    <>
    <InstallPrompt />
    <AppDashboard />
    </>
  );
}

export default page;