import { useContext } from "react";
import { ProductContext } from "./product-context";

export function useProducts() {
  return useContext(ProductContext);
}
