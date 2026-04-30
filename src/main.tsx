import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App";
import { store } from "./app/store";
import { queryClient } from "./app/queryClient";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <Toaster richColors closeButton position="top-right" />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
