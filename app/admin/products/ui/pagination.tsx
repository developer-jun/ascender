
import { SVG } from '@/components/svg'
import { cn } from '@/utils/helpers'
import React, { memo, ReactNode } from 'react'

type PaginationType = {
  previous: ReactNode,
  pages: ReactNode,
  next: ReactNode,
  children: ReactNode
}
const Pagination = ({previous, pages, next, children}: PaginationType) =>{
  return (
    <div className="join">
      {previous}
      {pages}
      {children}
      {next}      
    </div>
  )
}
{/*<button className="join-item btn btn-sm">1</button>
<button className="join-item btn btn-sm btn-active">2</button>
<button className="join-item btn btn-sm">3</button>
<button className="join-item btn btn-sm">4</button>*/}

type PageType = {
  page: number, 
  onGotoPage: (num: number)=>void, 
  className?: string,
  icon: string,
  isActive?: boolean
}

const Previous = ({page, icon, onGotoPage, className = ''}: PageType) => {
  return <button className={className} onClick={e=>onGotoPage(page)}><SVG icon={icon} /></button>
}

const Next = ({page, icon, onGotoPage, className = ''}: PageType) => {
  return <button className={className} onClick={e=>onGotoPage(page)}><SVG icon={icon} /></button>
}

const Page = ({page, onGotoPage, isActive, className}: PageType) => {
  return <button className={cn(isActive ? 'btn-active' : '', className)} onClick={e=>{onGotoPage(page)}}>{page}</button>
}

type PagesType = {
  totalPage: number, 
  onGotoPage: (num: number)=>void, 
  activePage: number,
  className?: string
}
const Pages = ({totalPage, onGotoPage, activePage, className = ''}: PagesType) => {
  let content: React.ReactNode[] = [];  

  for (let index = 1; index <= totalPage; index++) {   
    content.push(<Page key={index} icon='' page={index} onGotoPage={onGotoPage} isActive={activePage === index} className={className} />);
  }
  return content;
}

Pagination.Previous = Previous;
Pagination.Next = Next;
Pagination.Pages = Pages;

export default Pagination;