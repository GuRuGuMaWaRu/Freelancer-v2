import { useLocation, NavLink } from "react-router-dom";
import clsx from "clsx";

import styles from "./NavBar.module.css";

const navLinks = [
  { to: "/", name: "Main" },
  { to: "/projects", name: "Projects" },
  { to: "/clients", name: "Clients" }
];

function NavBar() {
  const { pathname } = useLocation();

  const navItems = navLinks.map(({ to, name }) => (
    <li key={name}>
      <NavLink
        className={clsx(styles.navItem, pathname === to && styles.active)}
        to={to}
        end={to === "/" ? true : false}
      >
        {name}
      </NavLink>
    </li>
  ));

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navItemList}>{navItems}</ul>
    </nav>
  );
}

export { NavBar };
