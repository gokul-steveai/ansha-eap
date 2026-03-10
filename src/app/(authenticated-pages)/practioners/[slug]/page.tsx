
import PractionerSingle from "@/components/desktop/practitioner/practitionerSingle";
import PractionerSingleMoBile from "@/components/mobile/practitioner/practitionerSingle";
import { isMobileUA } from "@/lib/isMobileUa";

interface PractionerSingleProps {
  params: Promise<{ slug: string }>;
}
export default async function PractitionerSinglePage({params}:PractionerSingleProps) {
  const isMobile = await isMobileUA()
  return (
  isMobile ? <PractionerSingleMoBile params={params} /> : <PractionerSingle params={params} />
  );
}
