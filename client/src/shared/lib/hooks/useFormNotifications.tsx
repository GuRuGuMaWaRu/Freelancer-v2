import React from "react";
import { useNotification } from "app";

//** Shows notifications based on the fetcher data */
//** TODO: feels hacky, I'd rather the logic was more transparent maybe like a Notification context that can just be used to show notifications anywhere */
export function useFormNotifications(fetcherData: any, isLoading: boolean) {
  const notify = useNotification();

  React.useEffect(() => {
    if (fetcherData && !isLoading) {
      if (fetcherData.status === "success") {
        notify.showSuccess(fetcherData.message);
      } else {
        notify.showWarning(fetcherData.message);
      }
    }
  }, [fetcherData, isLoading, notify]);
}
