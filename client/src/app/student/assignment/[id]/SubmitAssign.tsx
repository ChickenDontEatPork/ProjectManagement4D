import './styles.css';
import { FilesAnnounce } from '@/interfaces/announce.interface';
import Image from 'next/image';
import pdfIcon from '@/mocks/pdf_icon.png';
import Link from 'next/link';

type paramsSubmit = {
  files: FilesAnnounce[] | undefined;
  cancelSubmit: () => void;
};

const SubmitAssign = ({ cancelSubmit, files }: paramsSubmit) => {
  const getUrlTypeFile = (urlFile: string) => {
    return urlFile.split(/[#?]/)[0].split('.').pop()?.trim();
  };

  return (
    <div className='youWork'>
      <div>Your Work</div>
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
      <button className='cancelButton' onClick={() => cancelSubmit()}>
        Unsubmit
      </button>
    </div>
  );
};

export default SubmitAssign;
