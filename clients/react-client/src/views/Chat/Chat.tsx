import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ApiService from "../../service/api.service";
import TokenService from "../../service/token.service";

function Chat() {
  const navigate = useNavigate();
  const data = useLoaderData({ from: "/chat" });
  // const info = useQuery({
  //   queryKey: ["chats"],
  //   queryFn: ApiService.fetchChats,
  //   retry: 2,
  // });

  useEffect(() => {
    console.log(data);
  }, [data]);

  const logout = () => {
    TokenService.deleteTokens();
    navigate({ to: "/signin" });
  };

  return (
    <div>
      Chat
      <input type="button" onClick={logout} value="logout" />
    </div>
  );
}

export default Chat;
