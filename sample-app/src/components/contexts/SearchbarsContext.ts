import { createContext } from "react";

export const ConnectedSearchBarsContext = createContext<{searchBarsInput: Record<string, string> }>({ searchBarsInput: {} });