import { useState, useCallback } from 'react';

/**
 * useApi - Custom hook for API calls with loading and error state
 * @param {function} apiFunc - The API function to call (should return a promise)
 * @returns {object} { data, loading, error, request }
 */
export function useApi(apiFunc) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunc(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'API Error');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return { data, loading, error, request };
}
