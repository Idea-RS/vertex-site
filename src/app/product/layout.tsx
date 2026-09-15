import { ProductTabs } from "@/components/ProductTabs";

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductTabs />
      {children}
    </>
  );
}
