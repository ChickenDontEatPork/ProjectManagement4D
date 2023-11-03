import React, { useState } from 'react';

type GroupCardProps = {
  number: number;
  numberGroup: number;
  members: string[];
};

const GroupCard = (props: GroupCardProps) => {
  const [isAdding, setIsAdding] = useState(false);

  const toggleAddCancel = () => {
    setIsAdding(!isAdding);
  };

  return (
    <div className='mb-[5px] w-full rounded-lg border bg-white p-[10px] shadow-sm hover:bg-slate-200 md:mb-[5px] md:w-full'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
        <div className='text-[14px]'>
          No: {props.number} Number Group: {props.numberGroup}
        </div>
        <div className='items-end md:flex'>
          <ul>
            {props.members.map((member, index) => (
              <li key={index}>{member}</li>
            ))}
          </ul>
        </div>
        <div className='flex justify-between gap-[10px] md:ml-[10px] md:flex md:flex-col'>
          <button
            className={`w-full rounded-[6px] border-[1px] text-[12px] text-white ${
              isAdding
                ? 'bg-red-500 px-[5px] py-[5px]'
                : 'bg-green-500 px-[12px] py-[5px]'
            }`}
            onClick={toggleAddCancel}
          >
            {isAdding ? 'Cancel' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
