import { ROUTES } from "../../config/routes";
import { ActiveLink } from "../ActiveLink";
import { SignInButton } from "../SignInButton";
import styles from "./styles.module.scss";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ignews" />
        <nav>
          <ActiveLink
            activeClassName={styles.active}
            href={ROUTES.HOME}
            prefetch
          >
            <a href="#">Home</a>
          </ActiveLink>
          <ActiveLink
            activeClassName={styles.active}
            href={ROUTES.POSTS}
            prefetch
          >
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}
