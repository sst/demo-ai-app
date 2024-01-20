import Link from "next/link";
import styles from "./movie-card.module.css";

interface MovieCardProps {
  id: string;
  title: string;
  poster: string;
  hint?: string;
}
export default function MovieCard(props: MovieCardProps) {
  return (
    <Link
      title={props.hint}
      className={styles.card}
      prefetch={false}
      href={`/movie/${props.id}`}
    >
      <img src={props.poster} alt={props.title} className={styles.cardImage} />
    </Link>
  );
}
