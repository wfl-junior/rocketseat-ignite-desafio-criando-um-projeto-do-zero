import Link from "next/link";
import commonStyles from "../../styles/common.module.scss";
import { Logo } from "../Logo";
import styles from "./styles.module.scss";

export const Header: React.FC = () => (
  <header className={styles.header}>
    <div className={commonStyles.container}>
      <Link href="/">
        <a className={styles.logoLink}>
          <Logo />
        </a>
      </Link>
    </div>
  </header>
);

export default Header;
