import { useCallback, useEffect, useRef, useState } from 'react'
//import { FetchResult } from '@/types/common';
//import { isUrlValid } from '../app/admin/utils/helpers';

/**
 * useProducts custom hook
 *  - used to do API call to the server to retrieve Products
 *  - Note that this custom hook will do the retrieval on page load and used querystring sent by the parent component or hook.
 *  - We do have an option to trigger the retrieval of data to the server again by calling the function refreshProducts
 *    - it's still going to use the querystring sent by the parent component
 * @param queryString 
 * @returns 
 */
export default function useFetchAPI<T>(url: string = '') {
  const [ data, setData ] = useState<T[] | null>(null); // API return data
  const [ count, setCount ] = useState(0);
  const [ error, setError ] = useState(''); // controls the start and end of the fetching
  const [ loading, setLoading ] = useState(false); // controls the start and end of the fetching
  const abortController = useRef<AbortController | null>(null);
  
  console.log('useFetchAPI URL: ', url);
  
  const fetchAPI = async () => {
    console.log('Initiating API call');
    setLoading(true); // initial loading state
    if(url) { //isUrlValid(url)
      if (abortController.current) {
        abortController.current.abort();
      }

      abortController.current = new AbortController();
    } else {
      console.log('API Request terminated, url is empty');
      setError('URL is empty OR invalid, unable to fetch data');
      setLoading(false);
      return;
    }
      
    try {      
      console.log('fetching url: ', url);
      const response = await fetch(url, { signal: abortController.current.signal });
  
      if (!response.ok) {
        throw new Error('The server seems to be unreachable. A server maintenance is probably in progress. Please try again later.'); // go to catch
      }
  
      const result = await response.json();
      console.log('API result: ');
      console.log(result);
      
     
      if(Array.isArray(result.data)){
        setData(result.data)
      } else {
        if(result.data !== undefined) {
          setData(result.data);          
        }
        if(result.count !== undefined) {
          setCount(result.count);
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError(error.message);
      }
    } finally {
      if (!abortController.current.signal.aborted) {
        setLoading(false);
      }
    }
  } // when url changes, this function will also be recreated thus changing reference

  useEffect(() => {
    console.log('useFetchAPI useEffect url: ', url);
    if(url) {
      fetchAPI();
    }
    return () => {
      abortController.current?.abort();
    };
  }, [url]);
  
  return { data, count, loading, error };
}
