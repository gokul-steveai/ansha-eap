import { HalaxyBookingServiceContextProvider } from "@/context/HalaxyBookingServiceContext";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <HalaxyBookingServiceContextProvider>
      {children}
    </HalaxyBookingServiceContextProvider>
  );
}
