"use client";

import styles from "./search.module.css";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [term, setTerm] = useState("");

  function handleChange(ev: React.ChangeEvent<HTMLInputElement>) {
    setTerm(ev.target.value);
  }

  function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <MagnifyingGlassIcon className={styles.searchIcon} />
      <input
        autoFocus
        type="text"
        onChange={handleChange}
        className={styles.search}
        placeholder="Search for a movie..."
        defaultValue={searchParams.get("query")?.toString()}
      />
    </form>
  );
}
