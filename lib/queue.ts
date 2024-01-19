export async function queue<T, R>(
  concurrency: number,
  items: T[],
  processItem: (item: T) => Promise<R>,
) {
  const workers = [...new Array(concurrency)];
  await Promise.all(
    workers.map(async (_, index) => {
      let count = 0;
      while (true) {
        const item = items.pop();
        if (!item) {
          break;
        }
        await processItem(item);
        count++;
      }
    }),
  );
}
