'use client';
import './styles.css';
import { VscSend } from 'react-icons/vsc';
import Image from 'next/image';
import * as yup from 'yup';
import { CommentAssignment } from '@/interfaces/assign.interface';
import { useState } from 'react';
import { CommentAnnoucement } from '@/interfaces/announce.interface';
import { RiDeleteBin5Line } from 'react-icons/ri';

const CommentCard = ({
  data,
  addComment,
  deleteComment,
  userId,
}: {
  data: CommentAssignment[] | CommentAnnoucement[];
  addComment: (comment: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  userId: string | undefined;
}) => {
  let [textComment, setTextComment] = useState('');
  return (
    <div className='commentCard w-full'>
      <p className='commentText'>Comments</p>

      <div>
        {data?.map((e) => (
          <div key={e.id} className='userCommentCard group/item'>
            {userId == e.Users.id ? (
              <button
                className=' deletecomment '
                onClick={() => deleteComment(e.id)}
              >
                <RiDeleteBin5Line />
              </button>
            ) : (
              <></>
            )}
            <Image
              src='https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg'
              width={50}
              height={20}
              className=' rounded-full'
              alt='Picture of the author'
            />
            <div className='w-full'>
              <p className='w-100 flex justify-between'>
                {e.Users.name ? (
                  <label>
                    {e.Users.name}+{'  '}+{e.Users.name}
                  </label>
                ) : (
                  <label>{e.Users.email}</label>
                )}
                {userId == e.Users.id ? (
                  <label className='datecommenthover'>
                    {new Date(e.createAt).toLocaleString('en-US', {
                      timeZone: 'Asia/Jakarta',
                    })}
                  </label>
                ) : (
                  <label className='invisible absolute right-0 group-hover/item:visible'>
                    {new Date(e.createAt).toLocaleString('en-US', {
                      timeZone: 'Asia/Jakarta',
                    })}
                  </label>
                )}
                <label className='datecomment'>
                  {new Date(e.createAt).toLocaleString('en-US', {
                    timeZone: 'Asia/Jakarta',
                  })}
                </label>
              </p>
              <p>{e.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='Comment'>
        <input
          onKeyUp={(e) => {
            //   //disable btn and input
            if (e.key === 'Enter') {
              addComment(textComment).then(() => {
                setTextComment('');
                //     //enable btn and input
              });
            }
          }}
          value={textComment}
          onChange={(event) => {
            setTextComment(event?.target.value);
          }}
          className='addComment'
          type='text'
          placeholder='add comment...'
        />
        <button
          type='submit'
          className='iconComment'
          onClick={() => {
            //disable btn and input
            addComment(textComment).then(() => {
              setTextComment('');
              //enable btn and input
            });
          }}
        >
          <VscSend />
        </button>
      </div>
    </div>
  );
};

export default CommentCard;
