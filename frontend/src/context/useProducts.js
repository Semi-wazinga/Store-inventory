import { useContext } from "react";
import { ProductContext } from "./product-context";

export const useProducts = () => useContext(ProductContext);
