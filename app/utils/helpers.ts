import { StockStatuses } from "@/types/product"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const URL_API_BASE = '/api';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const isEmail = (email: string = '') => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const isEmpty = (obj: Record<string, any>): boolean =>{
  return Object.keys(obj).length === 0;
}

export class HttpFetchError extends Error {
  constructor(public response: Response) {
    super(`HTTP error ${response.status}`);
  }
}

export const httpFetch = async (url: string, options: RequestInit) => {
  const result = await fetch(url, options);
  if (!result.ok) {
    throw new HttpFetchError(result);
  }
  return await result.json();
}

type MyRecord = Record<string, number>;
//type MyMap = Map<string, number>;
//let map = new Map<string, string>();
export const convertToKeyPaired = (data: unknown): Map<string, string> => {  
  let map = new Map<string, string>();
  if (data && typeof data === 'object') {
    Object.keys(data).forEach(key => {
      map.set(key, data[key]);
      // console.log(`['key: ' ${key}']: ${data[key]}`);
      //formData.append(key, data[key]);
      //return convertToFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
    });
  }
  return map;
}; 


export const convertToFormData = (data: unknown): FormData => {  
  const formData = new FormData();
  if (data && typeof data === 'object') {
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
      //record[key] = data[key];
      //return convertToFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
    });
  }

  return formData;
}; 

export const formatSlug = (data: string) : string => {
  return data.replace(/[^a-zA-Z0-9- ]/g, "").replace(/ /g, "-").toLowerCase(); // used for the slug, exclude non-numeric chars
}

export const safeBooleanData = (data: [unknown]): data is [boolean] => {
  return typeof data === "boolean" ? data : false;
}

export const safeENUMData = <T>(data: keyof typeof StockStatuses): StockStatuses => {
  const stockStatus = StockStatuses[data];

  return (typeof stockStatus === 'undefined') ? StockStatuses.INSTOCK : stockStatus;
}

// 191 is Prisma's default for any string data type
export const safeData = (data: string, maxLength: number = 191) => {
  return (data.length > maxLength) ? data.substring(0, maxLength) : data;
};