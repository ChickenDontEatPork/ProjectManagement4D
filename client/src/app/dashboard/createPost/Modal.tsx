import React, { useEffect, useState } from 'react';
import AddSearch from './AddSearch';
import GroupCard from './GroupCard';
import { RxCross2 } from 'react-icons/rx';

const Modal = () => {
  const groupData = [
    {
      number: 1,
      numberGroup: 28,
      groupName: 'test01',
      members: ['นางสาวxxxxx xxxxxxxxxxxxx', 'นางสาวxxxxx', 'xxxxxxxxxxxxx'],
    },
    {
      number: 2,
      numberGroup: 28,
      groupName: 'tdawdad',
      members: ['นางสาวxxxxx xxxxxxxxxxxxx', 'นางสาวxxxxx', 'xxxxxxxxxxxxx'],
    },
    {
      number: 3,
      numberGroup: 28,
      groupName: 'group',
      members: ['นางสาวxxxxx xxxxxxxxxxxxx', 'นางสาวxxxxx', 'xxxxxxxxxxxxx'],
    },
    {
      number: 4,
      numberGroup: 28,
      groupName: 'hello',
      members: ['นางสาวxxxxx xxxxxxxxxxxxx', 'นางสาวxxxxx', 'xxxxxxxxxxxxx'],
    },
    {
      number: 5,
      numberGroup: 28,
      groupName: 'wtf',
      members: ['นางสาวxxxxx xxxxxxxxxxxxx', 'นางสาวxxxxx', 'xxxxxxxxxxxxx'],
    },
    {
      number: 6,
      numberGroup: 28,
      groupName: 'name',
      members: ['นางสาวxxxxx xxxxxxxxxxxxx', 'นางสาวxxxxx', 'xxxxxxxxxxxxx'],
    },
    {
      number: 7,
      numberGroup: 28,
      groupName: 'sawasdee',
      members: ['นางสาวxxxxx xxxxxxxxxxxxx', 'นางสาวxxxxx', 'xxxxxxxxxxxxx'],
    },
    {
      number: 8,
      numberGroup: 28,
      groupName: 'dev',
      members: ['นางสาวxxxxx xxxxxxxxxxxxx', 'นางสาวxxxxx', 'xxxxxxxxxxxxx'],
    },
    {
      number: 8,
      numberGroup: 28,
      groupName: 'dev',
      members: ['นางสาวxxxxx xxxxxxxxxxxxx', 'นางสาวxxxxx', 'xxxxxxxxxxxxx'],
    },
    {
      number: 8,
      numberGroup: 28,
      groupName: 'dev',
      members: ['นางสาวxxxxx xxxxxxxxxxxxx', 'นางสาวxxxxx', 'xxxxxxxxxxxxx'],
    },
    {
      number: 8,
      numberGroup: 28,
      groupName: 'dev',
      members: ['นางสาวxxxxx xxxxxxxxxxxxx', 'นางสาวxxxxx', 'xxxxxxxxxxxxx'],
    },
  ];

  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 5;

  const [searchValue, setSearchValue] = useState<string>('');

  let filteredGroup = groupData.filter((item) => {
    return item.groupName.toLowerCase().includes(searchValue.toLowerCase());
  });

  const totalItems = filteredGroup.length;

  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const getDisplayedGroups = () => {
    return filteredGroup.slice(startIndex, endIndex);
  };

  const setPage = (numPage: number) => {
    setCurrentPage(numPage);
  };
  useEffect(() => {}, [currentPage]);

  const [addAllClicked, setAddAllClicked] = useState(false);

  return (
    <>
      <div>
        <button
          className='rounded-[6px] border-[1px] border-[#545F71] bg-[#545F71] px-[12px] py-[6px] text-[12px] text-white md:mt-[13px]'
          type='button'
          onClick={() => setShowModal(true)}
        >
          Choose Group
        </button>
      </div>
      {showModal ? (
        <>
          <div className='fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden bg-black bg-opacity-50 outline-none focus:outline-none'>
            <div className='relative flex flex-col rounded-lg border-0 bg-[#fff] shadow-lg outline-none focus:outline-none md:h-[520px] md:w-[720px]'>
              <div className='border-blueGray-200 flex items-start justify-between rounded-t border-b border-solid p-5'>
                {/* search */}
                <AddSearch setSearchValue={setSearchValue} />
                {/* button */}
                <button
                  className={`flex items-center justify-center rounded-[6px] border-[1px] px-[5px] py-[5px] text-[#fff] ${
                    addAllClicked ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  onClick={() => setAddAllClicked(!addAllClicked)}
                >
                  {addAllClicked ? 'Cancel All' : 'Add All'}
                </button>

                <button
                  className='float-right ml-auto border-0 bg-transparent p-1  text-3xl font-semibold leading-none text-black outline-none focus:outline-none'
                  onClick={() => setShowModal(false)}
                >
                  <span className='flex h-6 w-6 outline-none focus:outline-none md:justify-center md:self-center'>
                    <RxCross2 />
                  </span>
                </button>
              </div>
              {/*body*/}
              <div>
                <div className='relative flex-auto p-6 text-[14px] '>
                  {/* Container for scrollable content */}
                  <div className='h-[300px] overflow-y-auto'>
                    {getDisplayedGroups().map((group, index) => (
                      <div key={index}>
                        <GroupCard
                          number={group.number}
                          numberGroup={group.numberGroup}
                          members={group.members}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className='border-blueGray-200 flex items-center justify-end rounded-b border-solid p-6'>
                  {/* <PaginationButtons
                    setCurrentPage={(num) => setPage(num)}
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    pageCount={pageCount}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};
export default Modal;
