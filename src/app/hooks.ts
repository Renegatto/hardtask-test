import { useState } from "react"

/** Use unique key */
export const useKey = (): {
  newKey: (withKey: (key: number) => void) => void
} => {
  const [i,setI] = useState(0)
  return {
    newKey: withKey => {
      setI(i + 1)
      withKey(i)
    } 
  }
}
