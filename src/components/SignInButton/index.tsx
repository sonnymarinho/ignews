import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";

import styles from "./styles.module.scss";

export function SignInButton() {
  const isUserLoggedIn = true;

  return (
    <button className={styles.container} type="button">
      <FaGithub color={isUserLoggedIn ? "#04d361" : "#eba417"} />
      {isUserLoggedIn ? "Your User Name" : "Sign In with GitHub"}
      {isUserLoggedIn && <FiX color="#737380" className={styles.closeIcon} />}
    </button>
  );
}
