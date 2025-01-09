import { useState, useEffect } from "react";

interface Props {
  url: string;
}

interface FetchResult<T> {
  data: T | null;
  isPending: boolean;
  error: string | null;
}

function useFetch<T>({ url }: Props): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        setIsPending(true);
        setError(null);
        const response = await fetch(url, { signal: abortController.signal });
        if (!response.ok) {
          throw new Error("Could not fetch the data for that resource");
        }
        const jsonData = await response.json();
        setData(jsonData);
        setIsPending(false);
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setIsPending(false);
          setError(err.message);
        }
      }
    };

    fetchData();

    return () => abortController.abort();
  }, [url]);

  return { data, isPending, error };
}

export default useFetch;
