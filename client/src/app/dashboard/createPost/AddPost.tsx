'use client';
import React, { useState, useEffect } from 'react';
import PostForm from './PostForm';
import UploadFile from './UploadFile';

const AddPost = () => {
  const [myFiles, setMyFiles] = useState<File[]>([]);
  return (
    <div className='flex h-full w-full flex-col items-start gap-10 px-[5%] py-[5%] md:flex-row md:items-center md:justify-center'>
      <PostForm urlFiles={myFiles} />

      <UploadFile
        urlFiles={myFiles}
        setUrlFiles={(files) => {
          setMyFiles(files);
        }}
      />
    </div>
  );
};

export default AddPost;
