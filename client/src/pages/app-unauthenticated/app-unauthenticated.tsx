import { Modal, Button } from "shared/ui";
import { LoginForm, RegisterForm } from "entities/auth";

import styles from "./app-unauthenticated.module.css";

function AppUnauthenticated() {
  return (
    <div className={styles.container}>
      <h1 className={styles.appTitle}>Freelancer</h1>
      <div className={styles.buttons}>
        <Modal title="Login" trigger={<Button>Login</Button>}>
          <LoginForm />
        </Modal>
        <Modal
          title="Register"
          trigger={<Button variant="secondary">Register</Button>}
        >
          <RegisterForm />
        </Modal>
      </div>
    </div>
  );
}

export default AppUnauthenticated;
