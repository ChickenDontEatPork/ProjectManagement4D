'use client';
import './styles.css';
import React, { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';

interface search {
  setSearchValue: (searchValue: string) => void;
}

const svgSearch =
  'M9.5 17c1.71 0 3.287-.573 4.55-1.537l4.743 4.744a1 1 0 0 0 1.414-1.414l-4.744-4.744A7.5 7.5 0 1 0 9.5 17zM15 9.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z';

const AddSearch = (props: search) => {
  const [searchText, setSearchText] = useState<string>('');
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchGroup = e.target.value;
    setSearchText(searchGroup);
  };

  const handleSearchButtonClick = () => {
    props.setSearchValue(searchText);
  };
  useEffect(() => {});
  return (
    <div className='flex flex-row-reverse justify-center md:flex-row md:justify-end'>
      <div className='mx-[1vw] flex items-center justify-end rounded-[6px] border border-[#4a5261]'>
        <input
          type='text'
          className={`SearchBox m-[5px] outline-none`}
          placeholder='Search Group Name'
          value={searchText}
          onChange={handleSearchChange}
        />
        <button
          className='mr-4 hover:scale-125'
          onClick={handleSearchButtonClick}
        >
          <BiSearch />
        </button>
      </div>
    </div>
  );
};
export default AddSearch;
