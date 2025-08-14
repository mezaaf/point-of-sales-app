import Script from "next/script";
import DetailOrder from "./_components/detail-order";
import { environment } from "@/configs/environment";

export const metadata = {
  title: "ZAF Cafe | Order Management",
};

declare global {
  interface Window {
    snap: any;
  }
}

export default async function DetailOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="w-full">
      <Script
        src={`${environment.NEXT_PUBLIC_MIDTRANS_API_URL}/snap/snap.js`}
        data-client-key={environment.NEXT_PUBLIC_MIDTRANS_ClIENT_KEY}
        strategy="lazyOnload"
        unsafe-inline
      />
      <DetailOrder id={id} />
    </div>
  );
}
