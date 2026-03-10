import { auth } from "@/auth";
import DialogNeedHelp from "@/components/dialogs/DialogNeedHelp";
import AppHeader from "@/components/header/appHeader";
import AppNav from "@/components/ui/nav/AppNav";
import { AppServiceContextProvider } from "@/context/appServiceContext";
import { ConfirmProvider } from "@/context/ConfirmContext";
import { HalaxyServiceContextProvider } from "@/context/HalaxyServiceContext";
import { GalleryContextProvider } from "@/context/ImageGalleryContext";
import { InboxProvider } from "@/context/InboxContext";
import { PostServiceProvider } from "@/context/postServiceContext";
import { PushNotificationProvider } from "@/context/PushNotificationContext";
import { getUserDashboardData } from "@/serverActions/crudUsers";
import { SessionProvider } from "next-auth/react";


const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === "true";
const isProd = process.env.NODE_ENV === "production"
export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const testUserId = isProd ? '7lCw6u7zmY ' : 'JxjTgX4_Tx'

  const session = await auth();
  const userId = session?.user.id || testUserId;

  if (!isTestMode && !session) return;

  const dashboardResult = await getUserDashboardData(userId);

  if (!dashboardResult.success || !dashboardResult.data) return;

  const data = {
    currentUser: dashboardResult.data.user,
    dailyActivities: dashboardResult.data.daily_activities,
    dailyCheckIns: dashboardResult.data.daily_check_ins,
    company: dashboardResult.data.company_data,
  };


  return (
    <SessionProvider>
      <AppServiceContextProvider data={data}>
        <ConfirmProvider>
          <HalaxyServiceContextProvider>
            <GalleryContextProvider>
              <PostServiceProvider>
                <PushNotificationProvider>
                  <InboxProvider>
                    <main className="flex flex-col md:flex-row flex-nowrap h-screen w-screen md:p-4 md:space-x-6">
                      <div>
                        <AppNav />
                      </div>
                      <div className="flex-1">
                        <AppHeader />
                        <div className="h-screen-header overflow-auto max-sm:p-2 max-sm:pt-0">{children}</div>
                      </div>
                    </main>
                    <DialogNeedHelp hideOnMobile />
                  </InboxProvider>
                </PushNotificationProvider>
              </PostServiceProvider>
            </GalleryContextProvider>
          </HalaxyServiceContextProvider>
        </ConfirmProvider>
      </AppServiceContextProvider>
    </SessionProvider>
  );
}
