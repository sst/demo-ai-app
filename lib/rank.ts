interface Result {
  score: number;
  metadata: {
    id: string;
  };
}
export function rankMovies(input: Result[]) {
  const results = {} as Record<string, number>;
  for (const result of input) {
    if (result.score < 0.79) continue;
    const existing = results[result.metadata.id] || 0;
    results[result.metadata.id] = existing + result.score;
  }
  return Object.keys(results).sort((a, b) => results[b] - results[a]);
}
