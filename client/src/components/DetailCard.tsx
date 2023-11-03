import React from 'react';
import './styles.css';
import { MdOutlineAssignment } from 'react-icons/md';
import { IoMegaphoneOutline } from 'react-icons/io5';
import { FilesAnnounce } from '@/interfaces/announce.interface';
import Image from 'next/image';
import pdfIcon from '@/mocks/pdf_icon.png';
import Link from 'next/link';

type datas = {
  icon: boolean;
  topic: string | undefined;
  date: string | undefined;
  detail: string | undefined;
  dueDate: string | undefined;
  files: FilesAnnounce[] | undefined;
};

const DetailCard = ({ topic, date, detail, icon, dueDate, files }: datas) => {
  const getUrlTypeFile = (urlFile: string) => {
    return urlFile.split(/[#?]/)[0].split('.').pop()?.trim();
  };

  let dueDateFormat = new Date(dueDate!);
  let atDateFormat = new Date(date!);
  return (
    <div className='detailCard w-full'>
      <div className='headDetailCard'>
        <div className='iconDetailCard'>
          {icon ? <MdOutlineAssignment /> : <IoMegaphoneOutline />}
        </div>
        <div className='blockTopic'>
          <div className='detailTopic'>
            <div className='w-[500px] overflow-hidden text-ellipsis'>
              {topic}
              <p className='text-[14px]'>
                {atDateFormat.toLocaleString('en-US', {
                  timeZone: 'Asia/Jakarta',
                })}
              </p>
            </div>
            {icon ? <p>{dueDateFormat.toUTCString()}</p> : <div></div>}
          </div>
        </div>
      </div>
      <div className='textDetail'>
        <p>{detail}</p>
      </div>
      <div className='mt-3 flex flex-col gap-3'>
        {files?.map((f) =>
          getUrlTypeFile(f.name) == 'pdf' ? (
            <Link
              key={f.id}
              href={`${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}/${f.bucket}/${f.name}`}
              className='flex w-[70%] items-center rounded-md border-2 bg-slate-100'
            >
              <Image
                width={20}
                height={20}
                src={pdfIcon}
                className='block h-[50px] w-[50px] object-contain'
                alt='pdf_icon'
              />
              <p>{f.name}</p>
            </Link>
          ) : (
            <Link
              key={f.id}
              href={`${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}/${f.bucket}/${f.name}`}
              target='_blank'
              className='flex w-[70%] items-center gap-2 rounded-md border-2 bg-slate-100 '
            >
              <Image
                width={20}
                height={20}
                src={`${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}/${f.bucket}/${f.name}`}
                className='h-[50px] w-[50px] rounded-l-[5px]'
                alt='thumbnail'
              />
              <p className='overflow-hidden text-ellipsis'>{f.name}</p>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default DetailCard;
