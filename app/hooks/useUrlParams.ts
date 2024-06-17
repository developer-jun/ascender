import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function useUrlParams(definedPath: string = '') {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlParams = new URLSearchParams(searchParams.toString());
  let urlPath = useRef(definedPath);

  useEffect(() => {   
    if(!definedPath) {
      //urlPath.current = `${location.pathname}`;
      urlPath.current = definedPath;
    }
  }, [definedPath]);
  
  const getCurrentParams = () => {
    return Object.fromEntries(searchParams);
  }

  const getParam = (param: string): string | null => {
    return searchParams.get(param);
  }

  const removeParam = (param: string) => {    
    urlParams.delete(param);
    router.push(`${urlPath.current}?${urlParams.toString()}`);
  }

  const clearParams = () => {
    router.push(`${urlPath.current}`);
  }
  
  const setUrlParam = (param: string, value: string) => {
    urlParams.set(param, value);
    router.push(`${urlPath.current}?${urlParams.toString()}`);
  }

  const setUrlParams = (params: any) => {
    console.log('[setUrlParams] ', params);
    if(params) {
      Object.entries(params).forEach(([key, value]) => {      
        if(value) {
          urlParams.set(key, value.toString());  
        } else {
          urlParams.delete(key);
        }
      }); 
    }
    router.push(`${urlPath.current}?${urlParams.toString()}`);
  }

  const redirectTo = (url: string) => {
    router.push(url);
  }

  const updateUrl = (queryString: string = '') => {
    router.push(`${urlPath.current}?${queryString}`);
  }

  return { updateUrl, redirectTo, getCurrentParams, getParam,removeParam,setUrlParam,setUrlParams,clearParams };
}
