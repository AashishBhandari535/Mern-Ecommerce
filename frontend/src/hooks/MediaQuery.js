import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

export default function UseMediaQuery(screenSize) {
  const [target, setTarget] = useState(null);
  const result = useMediaQuery({
    query: screenSize,
  });
  useEffect(() => {
    setTarget(result);
  }, [result]);
  return target;
}
