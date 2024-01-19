import { get } from "@/lib/dynamo";
import styles from "./page.module.css";
import Header from "@/components/header";
import MovieCard from "@/components/movie-card";

export async function generateMetadata({
  params,
}: {
  params: { name: string };
}) {
  return {
    title: `Tag: ${params.name}`,
  };
}

export default async function Page({ params }: { params: { name: string } }) {
  const data = await get();

  return (
    <>
      <Header breadcrumb={`Tag: ${params.name}`} />
      <ul className={styles.grid}>
        {data &&
          data
            .filter((movie) => movie.data.tags.includes(params.name))
            .map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.data.title}
                poster={movie.data.poster}
              />
            ))}
      </ul>
    </>
  );
}
