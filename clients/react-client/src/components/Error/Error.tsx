import { useRouteError } from "react-router-dom";

function Error() {
  let error = useRouteError();
  console.error(error);

  return <div>Error</div>;
}

export default Error;
