import React, { useCallback, useState } from 'react';
import UploadFile from './UploadFile';
import Image from 'next/image';
import { RxCross2 } from 'react-icons/rx';
import { useDropzone } from 'react-dropzone';

import pdfIcon from '@/mocks/pdf_icon.png';

export let files: any;
interface ModalUploadFileProps {
  submit: boolean; // Define the prop you expect here
}

const ModalUploadFile = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const svgUpload =
    'M17.3333 81.3333L17.3333 86.4166C17.3333 94.839 23.1536 101.667 30.3333 101.667L73.6666 101.667C80.8463 101.667 86.6666 94.839 86.6666 86.4166L86.6666 81.3333M69.3333 40.6666L51.9999 20.3333M51.9999 20.3333L34.6666 40.6666M51.9999 20.3333L51.9999 81.3333';

  const [myFiles, setMyFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setMyFiles([...myFiles, ...acceptedFiles]);
    },
    [myFiles]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      'image/*': [],
      'document/pdf': ['.pdf'],
      // 'document/zip': ['.zip'],
    },
    noClick: true,
    onDrop,
  });

  const removeFile = (file: File) => {
    const newFiles = [...myFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setMyFiles(newFiles);
  };

  files = myFiles.map((file: File) => {
    // Object.assign(file, {
    //   preview: URL.createObjectURL(file),
    // });
    const url: string = URL.createObjectURL(file);

    return (
      <div
        className='mt-[5px] flex h-[70px] w-[100%] items-center rounded-[5px] border-[1px] border-[#545F71] bg-[#545F71] text-[#FFFFFF]'
        key={file.name}
      >
        {file.type == ('image/png' || 'image/jpeg') ? (
          <Image
            width={30}
            height={30}
            src={URL.createObjectURL(file)}
            className='block h-[100%] w-[40%] rounded-l-[5px] bg-[#FFFFFF] object-contain'
            alt='thumbnail'
            // Revoke data uri after image is loaded
            onLoad={() => {
              URL.revokeObjectURL(url);
            }}
          />
        ) : (
          <Image
            width={30}
            height={30}
            src={pdfIcon}
            className='block h-[60%] w-[20%] object-contain'
            alt='pdf_icon'
          />
        )}
        <div className='flex w-[80%] items-center justify-between'>
          <div>{file.name}</div>
          <button onClick={() => removeFile(file)}>
            <RxCross2 />
          </button>
        </div>
      </div>
    );
  });

  return (
    <>
      <div>
        <button
          className='rounded-[6px] border-[1px] border-[#545F71] bg-[#545F71] px-[12px] py-[6px] text-[12px] text-white md:mt-[16px]'
          type='button'
          onClick={() => setShowModal(true)}
        >
          Browse file
        </button>
      </div>
      {showModal ? (
        <>
          <div className='fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden bg-black bg-opacity-50 outline-none focus:outline-none'>
            <div className='relative flex flex-col rounded-lg border-0 bg-[#fff] shadow-lg outline-none focus:outline-none'>
              <div className='border-blueGray-200 flex items-start justify-between border-solid p-5'>
                <h2 className='text-[16px] font-bold text-[#545F71]'>
                  Upload File
                </h2>
                {/* <AddSearch setSearchValue={setSearchValue} /> */}

                <button
                  className='float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black outline-none focus:outline-none'
                  onClick={() => setShowModal(false)}
                >
                  <span className='flex h-6 w-6 outline-none focus:outline-none md:justify-center md:self-center'>
                    <RxCross2 />
                  </span>
                </button>
              </div>
              <div>
                {/*body*/}
                <div className='m-5 mt-[-10px] max-h-[320px] min-w-[320px] rounded-[12px] border-4 border-dashed border-[#A8B0C0]'>
                  <div
                    {...getRootProps({
                      className: 'dropzone p-6 flex justify-center',
                    })}
                  >
                    <input {...getInputProps()} />
                    <button
                      type='button'
                      onClick={open}
                      className={`rounded-[6px] bg-[#545F71] px-[10px] px-[10px] py-[10px] py-[10px] text-[12px] text-[#FFFFFF] hover:bg-[#242931] `}
                    >
                      Browse File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};
export default ModalUploadFile;
