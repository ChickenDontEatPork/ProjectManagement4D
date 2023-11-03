'use client';
import React, { useState, useEffect } from 'react';
import DetailCard from '@/components/DetailCard';
import CommentCard from '@/components/CommentCard';
import Status from './Status';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Assignments, CommentAssignment } from '@/interfaces/assign.interface';

const Assignment = ({ params }: { params: { id: string } }) => {
  const session = useSession();
  const [assignmentData, setAssignmentData] = useState<Assignments>();
  const [assignmentFiles, setAssignmentFiles] = useState();
  const [refresh, setRefresh] = useState(false);
  const [commentAssignments, setCommentAssignments] = useState<
    CommentAssignment[]
  >([]);
  useEffect(() => {
    const fetch = async () => {
      try {
        let res = await axios(
          `${process.env.NEXT_PUBLIC_ENDPOINT}`.concat(
            '/assignment/' + `${params.id}`
          ),
          {
            headers: {
              Authorization: `Bearer ${session.data?.token}`,
            },
          }
        );
        setAssignmentData(res.data);
        setCommentAssignments(res.data?.CommentAssignments!);
        setAssignmentFiles(res.data.AssignmentFiles);
      } catch (e) {}
    };
    if (session.status === 'authenticated') {
      fetch();
    }
  }, [session, params, refresh]);
  let addComment = async (description: string) => {
    try {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_ENDPOINT}`.concat('/comments-assign'),
          {
            assignmentId: assignmentData?.id!,
            description: description,
          },
          {
            headers: {
              Authorization: `Bearer ${session.data?.token}`,
            },
          }
        )
        .then((response) => {
          setRefresh(true);
        });
    } catch (e) {}
  };

  const deleteComment = async (commentId: string) => {
    try {
      axios
        .delete(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/comments-assign/${commentId}`,
          {
            headers: {
              Authorization: `Bearer ${session.data?.token}`,
            },
          }
        )
        .then((response) => {
          setRefresh(true);
        });
    } catch (e) {}
  };

  return (
    <div className='min-h-screen gap-5 bg-[#F9F9F9] px-3 pb-5 pt-10 sm:flex'>
      <div>
        <DetailCard
          icon={true}
          topic={assignmentData?.title!}
          date={assignmentData?.dueAt!}
          detail={assignmentData?.description!}
          dueDate={assignmentData?.dueAt!}
          files={assignmentFiles}
        />
        <CommentCard
          data={commentAssignments}
          addComment={addComment}
          deleteComment={deleteComment}
          userId={session.data?.user.id}
        />
      </div>
      <div className='mt-3 sm:mt-0 '>
        <Status data={assignmentData?.AssignmentGroups!} />
      </div>
    </div>
  );
};

export default Assignment;
