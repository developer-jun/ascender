import { useRef, useState } from 'react'
import { JSONResult, MessagePrompt } from '@/types/common';
import { httpFetch, HttpFetchError } from '@/utils/helpers';
// import { isUrlValid } from '@/utils/helpers';

/**
 * useFetchRequest custom hook
 *  - main difference between this and useFetchAPI custom hook is that this custom hook will do the retrieval on demand or on event
 *  - useFetchAPI will fetch data as soon as the page loads or the URL changes. This however will only fetch data when user tells it to.
 * @param queryString 
 * @returns 
 */
export default function useFetchRequest<T, U>(url: string = '') {
  const [ fetchCounter, incrementFetch ] = useState(0);
  const [ data, setData ] = useState<JSONResult<T> | null>(null); // API return data
  const [ count, setCount ] = useState(0);
  const [ loading, setLoading ] = useState(false); // let us know the status of the request
  const abortController = useRef<AbortController | null>(null); // a safeguard to prevent multiple API calls

  const requestGuard = (): boolean => {
    setLoading(true);
    if(url) {
      // before starting, abort the previous request if there's any
      if (abortController.current) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();
      return true;
    } else {
      setData({
        status: 'failed', 
        prompt: { 
          messageType: 'error', 
          message: 'URL is empty, unable to fetch data'
        }
      });
      setLoading(false);
      return false;
    }
  }
  type FetchRequestProps = {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    fetchUrl?: string,    
    data?: U
  }
  const fetchRequest = async ({fetchUrl, method, data}: FetchRequestProps) => { 
    if(fetchUrl) {
      url += fetchUrl;
    }
    if( !requestGuard() ) return;     
    
    try {
      console.log('DOING POST: ', data);
      console.log('url: ', url);
      let httpFetchContent: any = { 
        signal: abortController.current?.signal, 
        method: method, 
        headers: { 
          'Content-Type': 'application/json' 
        },
      }
      if(method !== 'GET') {
        httpFetchContent['body'] = JSON.stringify({...data});
      }
      incrementFetch(prev => prev + 1);
      const result = await httpFetch(url, httpFetchContent);      
      console.log('FETCH RESULT: ', result);      
      // check if count is present
      if(Array.isArray(result)){
        setData({
          status: 'success',
          data: result as T[]
        })
      } else {
        if(result.data !== undefined) {
          setData({
            status: 'success',
            data: result.data
          });
        }
        if(result.count !== undefined) {
          setCount(result.count);
        }
      }
    } catch (error) {
      console.log('ERROR Encountered: ', error);
      if(error instanceof HttpFetchError) {
        setData({
          status: 'failed', 
          prompt: { 
            messageType: 'error', 
            message: error.message
          } as MessagePrompt
        });
      }
    } finally {
      if (!abortController.current?.signal.aborted) {
        setTimeout(() => {
          setLoading(false);
        }, 10)
      }
    }    
  }

  return { data, count, loading, fetchRequest, fetchCounter };
}
