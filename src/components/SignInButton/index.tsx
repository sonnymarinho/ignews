import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { signIn, signOut, useSession } from "next-auth/client";

import styles from "./styles.module.scss";

export function SignInButton() {
  const [session] = useSession();

  return (
    <button
      onClick={() => (session ? signOut() : signIn("github"))}
      className={styles.container}
      type="button"
    >
      <FaGithub color={session ? "#04d361" : "#eba417"} />
      {session ? session.user.name : "Sign In with GitHub"}
      {session && <FiX color="#737380" className={styles.closeIcon} />}
    </button>
  );
}
