import Link from "next/link";
import styles from "./tag.module.css";

interface TagProps {
  name: string;
}
export default function Tag({ name }: TagProps) {
  return (
    <Link className={styles.tagLink} href={`/tag/${name}`}>
      <aside className={styles.tag}>{name}</aside>
    </Link>
  );
}
