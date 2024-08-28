// Package imports
import { useEffect, useState } from "react";

const useWindowFocus = () => {
  const [focus, setFocus] = useState(document.hasFocus());

  useEffect(() => {
    const setFocusTrue = () => setFocus(true);
    const setFocusFalse = () => setFocus(false);

    window.addEventListener("focus", setFocusTrue);
    window.addEventListener("blur", setFocusFalse);

    return () => {
      window.removeEventListener("focus", setFocusTrue);
      window.removeEventListener("blur", setFocusFalse);
    };
  }, [setFocus]);

  return focus;
};

export default useWindowFocus;
