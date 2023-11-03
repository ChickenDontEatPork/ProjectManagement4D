'use client';
import { useState, useEffect } from 'react';
import DetailCard from '@/components/DetailCard';
import CommentCard from '@/components/CommentCard';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Assignments, CommentAssignment } from '@/interfaces/assign.interface';
import UploadFile from './UploadFile';
import UploadFileRespon from './UploadFileRespon';
import SubmitAssign from './SubmitAssign';

const Assignment = ({ params }: { params: { id: string } }) => {
  const session = useSession();
  const [assignmentData, setAssignmentData] = useState<Assignments>();
  const [assignmentFiles, setAssignmentFiles] = useState();
  const [token, setToken] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [check, setCheck] = useState(true);
  const [assignmentSuubmitFiles, setAssignmentSubmitFiles] = useState();
  const [myFiles, setMyFiles] = useState<File[]>([]);
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
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAssignmentData(res.data);
        setCommentAssignments(res.data?.CommentAssignments!);
        setAssignmentFiles(res.data.AssignmentFiles);
        // console.log(res.data.AssignmentFiles)
      } catch (e) {}
    };
    if (session.status === 'authenticated') {
      setToken(session.data.token!);
      fetch();
    }
  }, [session, params, token, refresh]);

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
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setRefresh(!refresh);
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
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setRefresh(!refresh);
        });
    } catch (e) {}
  };

  const submitAssign = () => {
    const formdata = new FormData();
    formdata.append('assignmentId', assignmentData?.id!);
    myFiles.forEach((urlFile) => {
      formdata.append('files', urlFile);
    });
    try {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/assignment-submit`,
          formdata,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        .then((response) => {
          console.log(response);
          if (response.status == 201) {
            try {
              const res = axios.get(
                `${process.env.NEXT_PUBLIC_ENDPOINT}/assignment/student/submit/${assignmentData?.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              // console.log(res)
            } catch (error) {}
            console.log(check);
            setCheck(false);
          }
        });
    } catch (e) {}
  };

  const cancelSubmit = () => {
    try {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/assignment-submit${assignmentData?.id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          if (response.status == 201) {
            setAssignmentSubmitFiles(undefined);
            setCheck(true);
          }
        });
    } catch (e) {}
  };

  return (
    <div className='flex min-h-screen flex-col items-center gap-5 bg-[#F9F9F9] px-3 pb-5 pt-10 xl:flex xl:flex-row xl:items-start'>
      <div>
        <DetailCard
          icon={true}
          topic={assignmentData?.title!}
          date={assignmentData?.dueAt!}
          detail={assignmentData?.description!}
          dueDate={assignmentData?.dueAt!}
          files={assignmentFiles}
        />
        <UploadFileRespon
          urlFiles={myFiles}
          setUrlFiles={(files) => {
            setMyFiles(files);
          }}
          submitAssign={submitAssign}
        />
        <CommentCard
          data={commentAssignments}
          addComment={addComment}
          deleteComment={deleteComment}
          userId={session.data?.user.id}
        />
      </div>
      {check ? (
        <UploadFile
          urlFiles={myFiles}
          setUrlFiles={(files) => {
            setMyFiles(files);
          }}
          submitAssign={submitAssign}
        />
      ) : (
        // <></>
        <SubmitAssign
          cancelSubmit={cancelSubmit}
          files={assignmentSuubmitFiles}
        />
      )}
    </div>
  );
};

export default Assignment;
