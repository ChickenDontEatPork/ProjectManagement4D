'use client';
import { useCallback, useState, useEffect } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { RxCross2 } from 'react-icons/rx';

import pdfIcon from '@/mocks/pdf_icon.png';
import './styles.css';

const svgUpload =
  'M17.3333 81.3333L17.3333 86.4166C17.3333 94.839 23.1536 101.667 30.3333 101.667L73.6666 101.667C80.8463 101.667 86.6666 94.839 86.6666 86.4166L86.6666 81.3333M69.3333 40.6666L51.9999 20.3333M51.9999 20.3333L34.6666 40.6666M51.9999 20.3333L51.9999 81.3333';

interface PostFormProps {
  urlFiles: File[];
  setUrlFiles: (files: File[]) => void;
  submitAssign: () => void;
}

const UploadFile = ({ urlFiles, setUrlFiles, submitAssign }: PostFormProps) => {
  const [myFiles, setMyFiles] = useState<File[]>([]);

  useEffect(() => {
    setUrlFiles(myFiles);
  }, [myFiles, setUrlFiles]);

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
      'document/docx': ['.docx'],
      'document/doc': ['.doc'],
    },
    noClick: true,
    onDrop,
  });

  const removeFile = (file: File) => {
    const newFiles = [...myFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setMyFiles(newFiles);
  };

  return (
    <div className='uploadRes'>
      <h2 className='text-[22px] font-bold text-[#545F71]'>Your work</h2>
      {myFiles.length === 0 && (
        <button
          type='button'
          onClick={open}
          className={`createPost_postForm_tag uploadFile_button mt-[4rem] justify-center px-[10px] py-[10px] text-[12px] hover:bg-[#242931] lg:mt-6`}
        >
          Browse File
        </button>
      )}
      <aside className='mt-[10px]'>
        <div className='no-scrollbar max-h-[320px] overflow-x-hidden overflow-y-scroll text-[12px]'>
          {myFiles.map((file: File) => {
            const url: string = URL.createObjectURL(file);

            return (
              <div
                className='no-scrollbar mt-[5px] flex h-[60px] w-[100%] items-center rounded-[5px] border-[1px] border-[#545F71] bg-[#545F71] text-[#FFFFFF]'
                key={file.name}
              >
                {file.type == 'image/png' ||
                file.type == 'image/jpeg' ||
                file.type == 'image/jpg' ? (
                  <div className='flex items-center'>
                    <Image
                      width={30}
                      height={30}
                      src={URL.createObjectURL(file)}
                      className='block w-[40%] rounded-l-[5px] bg-[#FFFFFF] object-contain'
                      alt='thumbnail'
                      // Revoke data uri after image is loaded
                      onLoad={() => {
                        URL.revokeObjectURL(url);
                      }}
                    />
                    <div className='file-name'>{file.name}</div>
                  </div>
                ) : (
                  <div className='flex items-center'>
                    <Image
                      src={pdfIcon}
                      className='block h-[50px] w-[50px] object-contain'
                      alt='pdf_icon'
                    />
                    <div className='file-name'>{file.name}</div>
                  </div>
                )}
                <div className='flex w-max items-center justify-between'>
                  <button
                    className='mr-[10px]'
                    onClick={() => removeFile(file)}
                  >
                    <RxCross2 />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {myFiles.length > 0 && (
          <button
            type='button'
            onClick={open}
            className={`hover-bg-[#242931] mt-3 w-full justify-center rounded-[6px] bg-[#545F71] px-[10px] 
            py-[10px] text-[12px] text-[#FFFFFF] hover:bg-[#242931] focus:bg-[#242931] md:px-[10px] md:py-[10px] lg:mt-6`}
          >
            Browse File
          </button>
        )}
      </aside>
      <button className='submitButton' onClick={() => submitAssign()}>
        Submit
      </button>
    </div>
  );
};
export default UploadFile;
