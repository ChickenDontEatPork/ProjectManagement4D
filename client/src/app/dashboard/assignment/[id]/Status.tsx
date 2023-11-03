'use client';
import React, { useState, useEffect } from 'react';
import Filtter from './Filtter';
import './styles.css';
import { AssignmentGroup } from '@/interfaces/assign.interface';

interface datas {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const Status = ({ data }: { data: AssignmentGroup[] }) => {
  const [selectStatus, setSelectStatus] = useState<string>('');
  const postFiltter = data?.filter((item) => {
    return selectStatus.toLowerCase() == ''
      ? item
      : item.Groups.Topics.name.toLowerCase().includes(selectStatus);
  });

  return (
    <div className='status'>
      <div className='mb-3 flex justify-between'>
        <div>
          <b>Status</b>
        </div>
        <div>
          {/* <Filtter show={(test: string) => setSelectStatus(test)} /> */}
        </div>
      </div>

      <div className='no-scrollbar h-[90%] overflow-y-auto'>
        {postFiltter?.map((data) => (
          <div
            key={data.Groups.id}
            className='mt-3 flex h-[40px] items-center justify-between rounded-lg border border-[#9BA5B7] px-4 shadow-md duration-300 hover:-translate-y-1'
          >
            <div>{data.Groups.Topics.name}</div>
            {/* <div
              className={`${
                data.userId == 1
                  ? 'bg-[#7DDEA3]'
                  : data.userId == 2
                  ? 'bg-[#E89B64]'
                  : 'bg-[#B5B5B5]'
              } h-3 w-3 rounded-full`}
            ></div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Status;
