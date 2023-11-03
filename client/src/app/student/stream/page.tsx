'use client';
import './styles.css';
import React, { useState } from 'react';
import AssignList from './(compont)/AssignList';
import Tabs from './(compont)/Tabs';
import PaginationButtons from './(compont)/PaginationButtons';
import StreamList from './(compont)/StreamList';
import AddSearch from './(compont)/AddSearch';

const Stream = () => {
  const handleSearchButtonClick = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };
  const [page, setPage] = useState('stream');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const resetTabsState = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className='flex h-full w-full min-w-[375px] flex-col items-center px-[2vw] py-0 transition-all md:px-[5vw] md:py-[2vh] lg:px-[10vw]'>
      <Tabs
        page={page}
        setPage={(tabs: string) => {
          resetTabsState();
          setPage(tabs);
        }}
      />
      <AddSearch onSearchButtonClick={handleSearchButtonClick} reSearch={''} />
      {page === 'assignment' ? (
        <AssignList
          setPageCount={setPageCount}
          currentPage={currentPage}
          searchTerm={''}
        />
      ) : (
        <StreamList
          setPageCount={setPageCount}
          currentPage={currentPage}
          searchTerm={searchTerm}
        />
      )}
      <PaginationButtons
        pageCount={pageCount}
        setPage={setCurrentPage}
        page={page}
      />
    </div>
  );
};

export default Stream;
