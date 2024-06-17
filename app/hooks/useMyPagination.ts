import { useState } from 'react'
/**
 * Pagination Hook
 * - Store data related to pagination
 * - Pagination related info only so that it can be reused
 * - If we add filters then it would be too specific to one page like products.
 * 
 * How should the data be received?
 * - On instantiation it's starts with empty array and the default pagination settings
 * - As the data trickles in, we passed that data via an exposed functions
 *   - addData(data: Product[] | null) - where we add the array of products into our localData variable
 *   - addTotal(total: number) - the api result count method.
 *   - setCurrentPage(pagenum: string) - given the page number, we can compute the startIndex and endIndex
 *     - startIndex = pagenum * itemsPerPage;
 *     - endIndex = startIndex + ((totals >= startIndex + itemsPerPage)?startIndex + itemsPerPage:totals);
 */

type UsePaginationProps = {
  total: number,
  activePage: number,
  parentCallback: (page: number) => void,
  itemsPerPage: number,
  
}
export default function useMyPagination({
  total,
  activePage = 1,
  parentCallback,
  itemsPerPage = 5,  
}: UsePaginationProps) {
  const [ totalPages, setTotalPages ] = useState(Math.ceil(total / itemsPerPage));

  if(totalPages) {
    let newTotalPages = Math.ceil(total / itemsPerPage);
    if(newTotalPages !== totalPages) {
      setTotalPages(newTotalPages);
    }
  }

  const handleGotoPage = (page: number) => {    
    // boundery checks
    if(page < 1) page = 1;
    if(page > Math.ceil(total / itemsPerPage)) page = Math.ceil(total / itemsPerPage);
    
    if(activePage === page) {
      console.log('SAME as BEFORE: ', page);
      // return abruptly, no need to update the parent
      return;
    } else {
      console.log('GOING TO ', page);
      parentCallback(page); // callback
    }    
  }
  
  return { totalPage: totalPages, handleGotoPage };
}