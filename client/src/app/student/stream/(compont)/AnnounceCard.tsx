'use client';
import Link from 'next/link';
import { BsFillBookmarkFill } from 'react-icons/bs';
import { RiDeleteBin5Line } from 'react-icons/ri';
type Props = {
  id: string;
  topic: string;
  date: Date;
  detail: string;
};

const AnnounceCard = (props: Props) => {
  return (
    <div className='group/item relative'>
      <Link
        href={`announcement/${props.id}`}
        className={'AnnounceCard group/item flex flex-col'}
      >
        <div className='flex items-center'>
          <div
            className={
              'flex h-[40px] w-[40px] items-center justify-center rounded-full bg-slate-600 p-2'
            }
          >
            <BsFillBookmarkFill className='text-xl text-white' />
          </div>
          <div className='ml-[2vw] flex w-[80%] flex-col '>
            <div className=' flex items-center overflow-hidden text-lg md:text-2xl '>
              {props.topic}
            </div>
            <div className='text-sm md:text-xs'>
              {props.date.toLocaleDateString('en-GB')}
            </div>
            <div className='line-clamp-1'>{props.detail}</div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AnnounceCard;
