import config from "@/config";
import { VectorClient } from "sst";
import Tag from "@/components/tag";
import Pulse from "@/components/pulse";
import styles from "./movie.module.css";
import Header from "@/components/header";
import MovieCard from "@/components/movie-card";
import { getById, batchGet } from "@/lib/dynamo";
import { rankMovies } from "@/lib/rank";

const vector = VectorClient("Vector");

export async function generateMetadata({ params }: { params: { id: string } }) {
  const item = await getById(params.id);
  return {
    title: item.data.title,
  };
}

export const dynamic = "force-static";
export const revalidate = 60;

export default async function Page({ params }: { params: { id: string } }) {
  const item = await getById(params.id);
  const data = item.data;

  const ret = await vector.retrieve({
    text: `# Title ${data.title} # Plot ${data.synopsis
      .join("\n")
      .substring(0, 32_000)}`,
    include: { type: "movie" },
    exclude: { id: params.id },
    count: 50,
  });
  const resultIds = rankMovies(
    ret.results.filter((r: any) => r.metadata.id !== params.id)
  ).slice(0, 5);
  const results = await batchGet(resultIds);

  return (
    <>
      <Header breadcrumb={data.title} />
      <section className={styles.section}>
        <div className={styles.hero}>
          <img
            src={data.poster}
            alt={data.title}
            className={styles.heroImage}
          />
        </div>
        <div className={styles.info}>
          <div className={styles.headline}>
            <h6 className={styles.year}>{data.year}</h6>
            <h2 className={styles.title}>{data.title}</h2>
          </div>
          <p className={styles.about}>{data.about}</p>
          {data.tags.length > 0 && (
            <div className={styles.tags}>
              {data.tags.map((tag: string) => (
                <Tag key={tag} name={tag} />
              ))}
              <Pulse title="Classify Data" className={styles.pulseTags}>
                Classify your data based on text that's more descriptive and
                carries more context.{" "}
                <a
                  target="_blank"
                  href={`${config.repo}/blob/main/load.ts#L803`}
                >
                  View source
                </a>
                .
              </Pulse>
            </div>
          )}
        </div>
      </section>
      {resultIds.length > 0 && (
        <>
          <div className={styles.relatedTitle}>
            <h3>Related</h3>
            <Pulse title="Semantically Related" className={styles.pulseRelated}>
              Find semantically similar data in your database.{" "}
              <a
                target="_blank"
                href={`${config.repo}/blob/main/app/movie/%5Bid%5D/page.tsx#L27`}
              >
                View source
              </a>
              .
            </Pulse>
          </div>
          <ul className={styles.related}>
            {resultIds.map((id) => {
              const movie = results.find((m) => m.id === id)!;
              const related = movie.data;
              return (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={related.title}
                  poster={related.poster}
                />
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}
