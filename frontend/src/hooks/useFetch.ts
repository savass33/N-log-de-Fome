import { useState, useEffect } from "react";
import { api } from "../services/api";

// Hook genérico para buscar dados (GET)
export function useFetch<T = unknown>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true; // Evita atualização de estado se o componente desmontar

    // Reseta estados ao mudar a URL
    setIsLoading(true);

    api
      .get(url)
      .then((response) => {
        if (isMounted) {
          setData(response.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, isLoading, error };
}
