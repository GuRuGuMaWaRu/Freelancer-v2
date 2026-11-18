import React from "react";
import { useModal } from "shared/ui";

//** TODO: just closes modal on success, don't like it at all */
export function useModalForm(fetcherData: any) {
  const { setIsOpen } = useModal();

  React.useEffect(() => {
    if (fetcherData?.status === "success") setIsOpen(false);
  }, [fetcherData, setIsOpen]);
}
