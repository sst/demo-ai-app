import { get } from "@/lib/dynamo";
import styles from "./page.module.css";
import Header from "@/components/header";
import MovieCard from "@/components/movie-card";

export default async function Home() {
  const data = await get();

  return (
    <>
      <Header controls />
      <ul className={styles.grid}>
        {data &&
          data.map((movie) => {
            const { data } = movie;
            return (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={data.title}
                poster={data.poster}
              />
            );
          })}
      </ul>
    </>
  );
}
