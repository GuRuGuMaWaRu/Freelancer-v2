import React, { Suspense } from "react";

import { FullPageSpinner } from "shared/ui/FullPageSpinner/FullPageSpinner";
import { useAuth } from "app";

const AppUnauthenticated = React.lazy(() =>
  import("pages/app-unauthenticated/app-unauthenticated")
);
const AppAuthenticated = React.lazy(() =>
  /* webpackPrefetch: true */ import(
    "pages/app-authenticated/app-authenticated"
  )
);

function App() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<FullPageSpinner />}>
      {user ? <AppAuthenticated /> : <AppUnauthenticated />}
    </Suspense>
  );
}

export { App };
