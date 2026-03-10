import { Suspense } from "react";
import Container from "../../components/ui/container";
import DialogNeedHelp from "@/components/dialogs/DialogNeedHelp";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen">
      <Container>
        <DialogNeedHelp />
        <Suspense fallback={<p>Loading...</p>}>
          {children}
        </Suspense>
        </Container>
    </div>
  );
}
