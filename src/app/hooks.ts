import { useCallback, useState } from "react";

/** Use unique key */
export const useKey = (): {
  newKey: (withKey: (key: number) => void) => void;
} => {
  const [i, setI] = useState(0);
  return {
    newKey: (withKey) => {
      setI(i + 1);
      withKey(i);
    },
  };
};

/**
 * Used to force-reset a component.
 * Use the key as the component key and call reset to reset the component by changing the key.
 */
export const useReset = (): [number, () => void] => {
  const [key, setKey] = useState(0);
  const reset = useCallback(() => setKey((key + 1) % 10), [key]);
  return [key, reset];
};
