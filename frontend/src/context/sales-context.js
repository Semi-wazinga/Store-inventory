import { createContext } from "react";

// Separate file that only exports the context object so files that export
// components don't also export non-component values (avoids fast-refresh lint).
export const SalesContext = createContext();

export default SalesContext;
