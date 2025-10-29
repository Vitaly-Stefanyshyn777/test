import ProductPage from "@/components/sections/ProductsSection/ProductPage/ProductPage";
import React from "react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPageRoute({ params }: ProductPageProps) {
  const { id } = await params;
  return <ProductPage productId={id} />;
}
