'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoIosAddCircle } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';

import './styles.css';
import { useSession } from 'next-auth/react';
import { Groups } from '@/interfaces/group.interface';
import { useRouter } from 'next/navigation';

interface PostFormProps {
  urlFiles: File[];
}

const PostForm = ({ urlFiles }: PostFormProps) => {
  const session = useSession();
  // type
  const [type, setType] = useState<boolean>(true);

  //var
  const [topic, setTopic] = useState<string>('');
  const [detail, setDetail] = useState<string>(' ');
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [dueDate, setDueDate] = useState<string>('');
  const [group, setGroup] = useState<Groups[]>([]);

  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let currentDate = `${year}-${month}-${day}`;
  const router = useRouter();

  useEffect(() => {
    if (session.status === 'authenticated') {
      const token = session.data?.token;

      try {
        axios
          .get('https://projectmanagement-api-dev.bxdman.com/tag', {
            headers: {
              Authorization: `Bearer ${session.data?.token}`,
            },
          })
          .then((res) => setOptions(res.data));
      } catch (e) {}
      try {
        axios
          .get('https://projectmanagement-api-dev.bxdman.com/group', {
            headers: {
              Authorization: `Bearer ${session.data?.token}`,
            },
          })
          .then((res) => setGroup(res.data.data));
      } catch (error) {}
    }
  }, [session]);

  const selectType = (select: number) => {
    if (select == 1 && !type) {
      setType(true);
      setDueDate('');
    } else if (select == 0 && type) {
      setType(false);
    }
  };

  // handle submit
  const handleSubmit = async () => {
    let token = session.data?.token!;
    console.log(token);

    // formData
    const formdata = new FormData();
    formdata.append('title', topic);
    formdata.append('description', detail);
    urlFiles.forEach((urlFile) => {
      formdata.append('files', urlFile);
    });

    if (!type) {
      if (topic !== '' && dueDate !== '') {
        group?.forEach((groupItem) => {
          formdata.append('groupId', groupItem.id);
        });
        formdata.append('dueAt', new Date(dueDate).toISOString());
        try {
          axios
            .post(
              'https://projectmanagement-api-dev.bxdman.com/assignment',
              formdata,
              {
                headers: {
                  Authorization: `Bearer ${session.data?.token}`,
                  'Content-Type': 'multipart/form-data',
                },
              }
            )
            .then((res) => {
              router.replace('/dashboard/stream');
            });
        } catch (e) {}
      } else if (topic === '') {
        alert('Please enter a topic.');
      } else if (dueDate === '') {
        alert('Please choose a duedate.');
      }
    } else if (type) {
      if (topic !== '' && tags.length !== 0) {
        tags.forEach((tag) => {
          formdata.append('tagId', tag.id);
        });

        try {
          axios
            .post(
              'https://projectmanagement-api-dev.bxdman.com/announcement',
              formdata,
              {
                headers: {
                  Authorization: `Bearer ${session.data?.token}`,
                  'Content-Type': 'multipart/form-data',
                },
              }
            )
            .then((res) => {
              router.replace('/dashboard/stream');
            });
        } catch (e) {}
      } else if (topic === '') {
        alert('Please enter a topic.');
      } else if (tags.length === 0) {
        alert('Please select a tags.');
      }
    }
  };

  //select show dropdown tag
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // group

  const selectTag = (newtag: { id: string; name: string }) => {
    setTags([...tags, newtag]);
    options.splice(options.indexOf(newtag), 1);
    setOptions(options);
    setShowDropdown(false);
  };

  const deleteTag = (tag: { id: string; name: string }) => {
    setOptions([...options, tag]);
    tags.splice(tags.indexOf(tag), 1);
    setTags(tags);
  };
  return (
    <div className='createPost_postForm h-[75%] '>
      {/* type */}
      <div className='mb-[15px] flex '>
        <button
          className={`createPost_postForm_typeButton 
              ${
                type
                  ? 'bg-[#545F71] text-[#FFFFFF]'
                  : 'text-[black] hover:bg-[#545F71] hover:text-[#FFFFFF]'
              } mr-[5px]`}
          disabled={type}
          onClick={() => selectType(1)}
        >
          Announcement
        </button>
        <button
          className={`createPost_postForm_typeButton
              ${
                type
                  ? 'text-[black] hover:bg-[#545F71] hover:text-[#FFFFFF]'
                  : 'bg-[#545F71] text-[#FFFFFF]'
              }`}
          disabled={!type}
          onClick={() => selectType(0)}
        >
          Assignment
        </button>
      </div>

      {/* Topic */}
      <div className=' mb-[15px] '>
        <h2 className='text-[22px] font-bold text-[#545F71]'>Topic</h2>
        <input
          type='topic'
          className='createPost_postForm_topicInput'
          placeholder='Topic'
          onChange={(e) => setTopic(e.target.value)}
          value={topic}
        />
      </div>
      {/* Tag & Due date */}
      <div
        className={`h-[45px] md:flex ${
          type ? null : 'md:justify-between'
        } mb-[10px] items-end`}
      >
        {!type ? (
          <div className='mt-[5px] md:flex md:w-full md:justify-between '>
            <div>
              <h2 className='text-[14px] text-[#545F71] '>Due-Date</h2>
              <input
                type='date'
                name='dueDate'
                min={`${currentDate}`}
                className='mb-[15px] rounded-[6px] border-[1px] border-[#545F71] px-3 py-1 text-[12px] text-[#545F71] md:mb-[-4px]'
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className='mt-[3px] flex gap-[10px]'>{/* <Modal /> */}</div>
          </div>
        ) : (
          <div className='flex md:mb-[-8px] md:flex md:flex-row md:px-[0] md:py-[5px] '>
            {tags.map((tag: { id: string; name: string }) => {
              return (
                <div
                  key={tag.id}
                  className='mr-[5px] flex flex-row items-center rounded-[6px] border-[1px] border-[#545F71] bg-[#545F71] px-[5px] py-[5px] text-[12px] text-[#fff]'
                >
                  <div>{tag.name}</div>
                  <button className='ml-[2px]' onClick={() => deleteTag(tag)}>
                    <RxCross2 />
                  </button>
                </div>
              );
            })}

            {/* dropdown */}
            <div
              className='dropdown flex '
              onClick={() => setShowDropdown(!showDropdown)}
              onBlur={() => setShowDropdown(false)}
            >
              {options.length != 0 ? (
                <button className='createPost_postForm_tag hover:bg-[#242931] focus:bg-[#242931]'>
                  <IoIosAddCircle />
                </button>
              ) : null}
              <ul
                className={`dropdown-content  ${
                  showDropdown ? 'flex-col' : 'hidden'
                }`}
              >
                {showDropdown
                  ? options.map((tag: { id: string; name: string }) => {
                      return (
                        <li
                          key={tag.id}
                          className='align-self-center z-[1] flex w-[100%] px-2 py-2 hover:bg-[#242931] '
                          onMouseDown={() => selectTag(tag)}
                        >
                          {tag.name}
                        </li>
                      );
                    })
                  : null}
              </ul>
            </div>
          </div>
        )}
      </div>
      <h2 className='mt-[20px] text-[16px] text-[#545F71]'>Detail</h2>
      <textarea
        name='details'
        spellCheck='false'
        className='mt-[10px] max-w-full  resize-none rounded-[15px] border-[1px] border-[black] p-[10px]'
        id='details'
        cols={55}
        rows={10}
        onChange={(e) => {
          setDetail(e.target.value);
        }}
        value={detail}
      ></textarea>
      {/* Submit */}
      <div className='mt-[15px] flex justify-center'>
        <button className='createPost_create' onClick={() => handleSubmit()}>
          Create
        </button>
      </div>
    </div>
  );
};
export default PostForm;
