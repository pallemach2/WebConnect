import { createFileRoute, redirect } from "@tanstack/react-router";
import TokenService from "../service/token.service";
import Chat from "../views/Chat/Chat";
import { queryOptions } from "@tanstack/react-query";
import RequestService from "../service/request.service";
import QueryService from "../service/query.service";

// Create Request Options for initial data
const chatsQueryOptions = queryOptions({
  queryKey: ["chatsInit"],
  queryFn: () => RequestService.get("/general/ping"),
});

export const Route = createFileRoute("/chat")({
  component: Chat,
  beforeLoad: () => {
    if (!TokenService.getLocalToken()) {
      throw redirect({ to: "/signin" });
    }
  },
  loader: () =>
    QueryService.getQueryClient().ensureQueryData(chatsQueryOptions),
});
