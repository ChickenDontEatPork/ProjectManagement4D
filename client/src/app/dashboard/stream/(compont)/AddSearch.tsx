'use client';
import './styles.css';
import React, { useState } from 'react';
import Link from 'next/link';

import { BiSearch } from 'react-icons/bi';

type Props = {};
type AddSearchProps = {
  onSearchButtonClick: (searchText: string) => void;
  reSearch: string;
  // onSearchTermChange: (term: string) => void;
};
const AddSearch = (props: AddSearchProps) => {
  const [searchText, setSearchText] = useState<string>('');
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onSearchButtonClick(e.target.value);
    // const searchtopic = e.target.value;
    // setSearchText(searchtopic);
  };

  const handleSearchButtonClick = () => {
    props.onSearchButtonClick(searchText);
  };

  return (
    <div className='flex w-full flex-row-reverse justify-center md:flex-row md:justify-end'>
      <Link href={'createPost'} className={`AddButton`}>
        Add
      </Link>
      <div className='mx-[1vw] flex items-center justify-end rounded-[6px] border border-[#4a5261]'>
        <input
          type='text'
          className={`SearchBox ml-2`}
          placeholder='Search Topic'
          value={props.reSearch}
          onChange={handleSearchChange}
        />
        <button
          className='pr-3 duration-300 hover:scale-125'
          onClick={handleSearchButtonClick}
        >
          <BiSearch />
          {/* <FcSearch /> */}
        </button>
      </div>
    </div>
  );
};

export default AddSearch;
