'use client';
import { AssignmentStatus } from '@/enums/status.enum';
import './styles.css';
import { BiTask } from 'react-icons/bi';
import Link from 'next/link';
// import { RiDeleteBin5Line } from 'react-icons/ri';
import { RxCross2 } from 'react-icons/rx';
import { RiDeleteBin5Line } from 'react-icons/ri';

type Props = {
  id: string;
  topic: string;
  name: string;
  status: AssignmentStatus;
  deadline: Date;
  deleteAssign: (announceId: string) => Promise<void>;
};

function getStatusColor(status: AssignmentStatus): string {
  switch (status) {
    case AssignmentStatus.NOTSEND:
      return 'bg-orange-400';
    case AssignmentStatus.SENDING:
      return 'bg-blue-400';
    case AssignmentStatus.TURNINLATE:
      return 'bg-green-400';
    case AssignmentStatus.REJECT:
      return 'bg-red-400';
    default:
      return 'bg-gray-400';
  }
}

const AssignCard = (props: Props) => {
  const statusColor = getStatusColor(props.status);
  return (
    <div className='group/item relative'>
      <button
        className='deletebin mt-[8px] flex items-center hover:text-red-500'
        onClick={() => props.deleteAssign(props.id)}
      >
        {/* <RxCross2 /> */}
        <RiDeleteBin5Line />
        {/* <RiDeleteBin5Line /> */}
      </button>
      <Link
        href={`assignment/${props.id}`}
        className={`AssignCard group/item flex items-center justify-between `}
      >
        <div className='flex  items-center justify-center'>
          <div className={`rounded-full p-2 ${statusColor}`}>
            <BiTask className='text-2xl text-white' />
          </div>
          <div className='ml-[2vw] flex items-center text-lg md:text-2xl'>
            <div>
              <p>{props.topic}</p>
              <p className='text-[16px]'>{props.name}</p>
            </div>
          </div>
        </div>
        <div className='mr-[15px] flex items-center text-lg md:text-[14px] lg:text-[16px]'>
          {props.deadline.toLocaleDateString('en-GB')}
        </div>
      </Link>
    </div>
  );
};

export default AssignCard;
