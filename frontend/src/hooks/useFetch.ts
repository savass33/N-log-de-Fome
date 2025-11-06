import { useState, useEffect } from 'react';
export const useFetch = (url: string) => {
  const [data, setData] = useState(null);
  useEffect(() => { /* Lógica de fetch */ }, [url]);
  return { data };
};