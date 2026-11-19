import { Outlet } from "react-router-dom";

import { TopBar, NavBar } from "widgets";

import styles from "./AppShell.module.css";

export function AppShell() {
  return (
    <div className={styles.appShell}>
      <TopBar />
      <NavBar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
