'use client';
import { Assignments } from '@/interfaces/assign.interface';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import AssignList from './(compont)/AssignList';
import PaginationButtons from './(compont)/PaginationButtons';
import AddSearch from './(compont)/AddSearch';
const Page = () => {
  const session = useSession();
  const [assignmentsData, setAssignmentsData] = useState<Assignments[]>([]);

  const handleSearchButtonClick = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };
  const [page, setPage] = useState('stream');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  return (
    <div className='flex h-full w-full min-w-[375px] flex-col items-center px-[2vw] py-0 transition-all md:px-[5vw] md:py-[2vh] lg:px-[10vw]'>
      {/* <AddSearch setSearchValue={handleSearchButtonClick} /> */}
      <AssignList
        setPageCount={setPageCount}
        currentPage={currentPage}
        searchTerm={searchTerm}
      />

      <PaginationButtons
        pageCount={pageCount}
        setPage={setCurrentPage}
        page={page}
      />
    </div>
  );
};

export default Page;
