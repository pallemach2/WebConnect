// Package Imports
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";

// Custom Imports
import { routeTree } from "./routeTree.gen";
import NotFound from "./components/general/NotFound/NotFound";
import QueryService from "./service/query.service";
import Loader from "./components/general/Loader/Loader";

// Styling
import "./styles/index.scss";

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFound,
  defaultPendingComponent: Loader,
  defaultPendingMinMs: 5000,
  defaultPendingMs: 1000,
});

declare global {
  interface Date {
    format(format: string): string;
  }
}

Date.prototype.format = function (format) {
  let date = this;
  return format.replace(/(yyyy|mm|dd|hh|MM|ss)/gi, (key) => {
    switch (key) {
      case "yyyy":
        return date.getFullYear().toString();
      case "mm":
        let x = (date.getMonth() + 1).toString();
        x = x.length === 1 ? "0" + x : x;
        return x;
      case "dd":
        let y = date.getDate().toString();
        y = y.length === 1 ? "0" + y : y;
        return y;
      case "hh":
        let z = date.getHours().toString();
        z = z.length === 1 ? "0" + z : z;
        return z;
      case "MM":
        let a = date.getMinutes().toString();
        a = a.length === 1 ? "0" + a : a;
        return a;
      case "ss":
        let b = date.getSeconds().toString();
        b = b.length === 1 ? "0" + b : b;
        return b;
      default:
        return key;
    }
  });
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      <QueryClientProvider client={QueryService.createQueryClient()}>
        <RouterProvider router={router} />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </StrictMode>
  );
}
