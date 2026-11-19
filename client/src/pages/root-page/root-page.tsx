import { useChangeBGColor } from "shared/lib";

import { AppShell } from "widgets/ui/AppShell/AppShell";

function Root() {
  useChangeBGColor();

  return <AppShell />;
}

export { Root };
