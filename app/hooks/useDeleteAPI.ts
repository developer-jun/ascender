import { useRef, useState } from 'react'
import { JSONResult, MessagePrompt } from '@/types/common';
import { httpFetch, HttpFetchError } from '@/utils/helpers';

export default function useDeleteAPI<T>(url: string = '') {
  const [ deleteResult, setData ] = useState<JSONResult<T> | null>(null); // API return data
  const [ loading, setLoading ] = useState(false); // let us know the status of the request
  const abortController = useRef<AbortController | null>(null); // a safeguard to prevent multiple API calls
  
  const requestGuard = (id: number): boolean => {
    setLoading(true);
    if(!id || id < 1) {
      setData({
        status: 'failed', 
        prompt: { 
          messageType: 'error', 
          message: 'ID provided is invalid'
        } as MessagePrompt
      });
      setLoading(false);

      return false;
    }
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
      setLoading(false);
      return false;
    }

    return true;
  }
  const deleteRequest = async (id: number, userUrl?: string) => {    
    if( !requestGuard(id) ) return;
      
    try {
      console.log('DOING DELETE for: ', id);
      const result = await httpFetch((userUrl ? userUrl : url) + '/' + id, { 
        signal: abortController.current?.signal, 
        method: 'DELETE', 
        headers: { 
          'Content-Type': 'application/json' 
        }
      });      
      console.log('DELETE RESULT: ', result);
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
        setLoading(false);
      }
    }
  }

  return { deleteResult, loading, deleteRequest };
}
