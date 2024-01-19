import Tag from "./tag";
import Pulse from "./pulse";
import Link from "next/link";
import config from "@/config";
import data from "@/data/movies.data";
import styles from "./header.module.css";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

interface HeaderProps {
  controls?: boolean;
  breadcrumb?: string;
}

export default function Header({ controls, breadcrumb }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.leftCol}>
        <h1>
          <Link href="/">❍ Movies</Link>
        </h1>
        {breadcrumb && (
          <div className={styles.breadcrumb}>
            <span className={styles.breadcrumbSeparator}>/</span>
            <h2 className={styles.breadcrumb}>{breadcrumb}</h2>
          </div>
        )}
      </div>
      {controls && (
        <div className={styles.rightCol}>
          <div className={styles.tags}>
            {data.tags.map((tag) => (
              <Tag name={tag.id} key={tag.id} />
            ))}
            <Pulse title="Classify Data" className={styles.pulseTags}>
              Classify your data based on text that's more descriptive and
              carries more context.{" "}
              <a
                target="_blank"
                href={`${config.repo}/main/data/movies.data.ts#L5`}
              >
                View source
              </a>
              .
            </Pulse>
          </div>
          <div className={styles.search}>
            <Link href="/search">
              <MagnifyingGlassIcon />
              <span>Search for a movie...</span>
            </Link>
            <Pulse title="Semantic Search" className={styles.pulseSearch}>
              Deep search your data using natural language.{" "}
              <a
                target="_blank"
                href={`${config.repo}/blob/main/app/search/page.tsx#L80`}
              >
                View source
              </a>
              .
            </Pulse>
          </div>
        </div>
      )}
    </header>
  );
}
