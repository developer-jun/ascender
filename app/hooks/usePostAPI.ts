import { useRef, useState } from 'react'
import { JSONResult, MessagePrompt } from '@/types/common';
import { httpFetch, HttpFetchError } from '@/utils/helpers';
// import { isUrlValid } from '@/utils/helpers';

/**
 * usePostAPI custom hook
 *  - used to do API call to do a POST request to the server
 *  - Note that this custom hook will do the retrieval on page load and used querystring sent by the parent component or hook.
 *  - We do have an option to trigger the retrieval of data to the server again by calling the function refreshProducts
 *    - it's still going to use the querystring sent by the parent component
 * @param queryString 
 * @returns 
 */
export default function usePostAPI<T>(url: string = '') {
  const [postResult, setData] = useState<JSONResult<T> | null>(null); // API return data
  const [loading, setLoading] = useState(false); // let us know the status of the request
  const abortController = useRef<AbortController | null>(null); // a safeguard to prevent multiple API calls
  
  const requestGuard = (): boolean => {
    if(url) {
      // before starting abort the previous request if there is one
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
        } as MessagePrompt
      });
      return false;
    }
  }
  const postRequest = async (data: T) => {    
    if( !requestGuard() ) return;
      
    try {
      setLoading(true);
      console.log('DOING POST: ', data);
      const result = await httpFetch(url, { 
        signal: abortController.current?.signal, 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json' 
        }, 
        body: JSON.stringify({...data}), 
      });      
      console.log('POST RESULT: ', result);
      setData(result);    
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
        //setLoading(false);
      }
    }
  }

  return { postResult, loading, postRequest };
}
