import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={styles.section}>
      <h2>Not Found</h2>
      <p>
        We couldn't find the page you were looking for,{" "}
        <Link className={styles.link} href="/">
          go back home
        </Link>
        .
      </p>
    </section>
  );
}
