import config from "@/config";
import { Suspense } from "react";
import { VectorClient } from "sst";
import type { Metadata } from "next";
import Pulse from "@/components/pulse";
import { batchGet } from "@/lib/dynamo";
import Header from "@/components/header";
import Search from "@/components/search";
import styles from "./search.module.css";
import MovieCard from "@/components/movie-card";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { rankMovies } from "@/lib/rank";

const vector = VectorClient("Vector");

export const metadata: Metadata = {
  title: "Search",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || "";

  return (
    <>
      <Header breadcrumb="Search" />
      <section>
        <Search />
      </section>
      {query === "" && (
        <section className={styles.samples}>
          <h3 className={styles.samplesTitle}>Sample Searches</h3>
          <ul className={styles.samplesList}>
            <li className={styles.samplesItem}>
              <a href="/search?query=time+travel">
                <MagnifyingGlassIcon />
                time travel
              </a>
            </li>
            <li className={styles.samplesItem}>
              <a href="/search?query=mobster+movies">
                <MagnifyingGlassIcon />
                mobster movies
              </a>
              <Pulse className={styles.pulseSearch} title="Semantic Search">
                Deep search your data using natural language.{" "}
                <a
                  target="_blank"
                  href={`${config.repo}/blob/main/app/search/page.tsx#L80`}
                >
                  View source
                </a>
                .
              </Pulse>
            </li>
            <li className={styles.samplesItem}>
              <a href="/search?query=space+exploration">
                <MagnifyingGlassIcon />
                space exploration
              </a>
            </li>
            <li className={styles.samplesItem}>
              <a href="/search?query=aircraft+crashing">
                <MagnifyingGlassIcon />
                aircrafts crashing
              </a>
            </li>
          </ul>
        </section>
      )}
      {query && (
        <Suspense
          key={query}
          fallback={<div className={styles.empty}>Loading...</div>}
        >
          <Results query={query} />
        </Suspense>
      )}
    </>
  );
}

async function Results({ query }: { query: string }) {
  const ret = await vector.retrieve({
    text: query,
    include: { type: "movie" },
    count: 25,
  });
  const resultIds = rankMovies(ret.results);
  const results = await batchGet(resultIds);

  return results.length === 0 ? (
    <div className={styles.empty}>No results. Needs more GPU.</div>
  ) : (
    <ul className={styles.grid}>
      {resultIds.slice(0, 5).map((item) => {
        const movie = results.find((m) => m.id === item)!;
        const data = movie.data;
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
  );
}
