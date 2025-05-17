import { db } from "@/lib/db";
import * as React from "react";

export function useCekIdentitas() {
  const [isIdentitasFilled, setIsIdentitasFilled] = React.useState<
    boolean | undefined
  >(undefined);

  React.useEffect(() => {
    async function cekIdentitas() {
      try {
        const identitas = await db.identitas.toArray();
        setIsIdentitasFilled(identitas.length > 0);
      } catch (error) {
        console.log(error);
        setIsIdentitasFilled(false);
      }
    }

    cekIdentitas();
  }, []);

  return isIdentitasFilled;
}
