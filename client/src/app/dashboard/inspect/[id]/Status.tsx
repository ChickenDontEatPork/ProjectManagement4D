'use client';
import React, { useState, useEffect } from 'react';
import Filtter from './Filtter';
import './styles.css';
import { AssignmentGroup } from '@/interfaces/assignment.interface';
import Link from 'next/link';

const Status = ({ data }: { data: AssignmentGroup[] }) => {
  const [selectStatus, setSelectStatus] = useState<string>('');
  let groups = data?.filter(
    (group) => group.Assignments?.AssignmentSubmit.length > 0
  );

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
        {groups?.map((data) => (
          <Link
            href={`/dashboard/inspect/`}
            key={data.Groups.id}
            className='mt-3 flex h-[40px] items-center justify-between rounded-lg border border-[#9BA5B7] px-4 shadow-md duration-300 hover:-translate-y-1'
          >
            <div className='flex justify-between p-2'>
              <div>{data.Groups.Topics.name}</div>
              <div>
              {data.Assignments.AssignmentSubmit[0].status}

              </div>
              
            </div>
          </Link>
        ))}
        {}
      </div>
    </div>
  );
};

export default Status;
