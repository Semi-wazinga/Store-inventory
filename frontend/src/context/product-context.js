import { createContext } from "react";

// Separate file for the context object so files that export components
// don't also export non-component values (satisfies react-refresh rule).
export const ProductContext = createContext();

export default ProductContext;
