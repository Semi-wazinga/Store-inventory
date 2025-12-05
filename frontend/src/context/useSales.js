import { useContext } from "react";
import { SalesContext } from "./sales-context";

export function useSales() {
  return useContext(SalesContext);
}
