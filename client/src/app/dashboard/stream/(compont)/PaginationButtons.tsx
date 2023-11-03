import React from 'react';
import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { MdArrowForwardIos, MdArrowBackIosNew } from 'react-icons/md';
type Props = {
  page: string;
  pageCount: number;
  setPage: (currentPage: number) => void;
};

const PaginationButtons = (props: Props) => {
  const [page, setPage] = useState(1);
  const handlePageChange = (selectedPage: any) => {
    setPage(selectedPage.selected + 1);
    props.setPage(selectedPage.selected + 1);
  };
  useEffect(() => {
    setPage(1);
  }, [props.page]);
  return (
    <div className='relative bottom-0 left-0 hidden w-full items-center justify-center py-[2vh] text-xl md:flex md:min-w-[400px]'>
      <ReactPaginate
        breakLabel='-'
        nextLabel={
          <MdArrowForwardIos className='h-10 w-10 border-slate-400 fill-slate-800 p-2' />
        }
        onPageChange={handlePageChange}
        pageRangeDisplayed={1}
        pageCount={props.pageCount}
        previousLabel={
          <MdArrowBackIosNew className='h-10 w-10 border-slate-400 fill-slate-800 p-2' />
        }
        renderOnZeroPageCount={null}
        containerClassName='flex text-slate-400 w-[30vw] justify-between min-w-[300px] items-center'
        pageClassName='h-8 w-8 flex justify-center items-center border-transparent'
        activeClassName='h-8 w-8 rounded-full bg-slate-600 text-white font-medium'
        disabledLinkClassName='opacity-40'
        forcePage={page - 1}
      />
    </div>
  );
};

export default PaginationButtons;
