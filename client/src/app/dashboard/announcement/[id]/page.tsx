'use client';
import { useEffect, useState } from 'react';
import DetailCard from '@/components/DetailCard';
import CommentCard from '@/components/CommentCard';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import {
  Announcement,
  CommentAnnoucement,
} from '@/interfaces/announce.interface';
const Announcement = ({ params }: { params: { id: string } }) => {
  const session = useSession();
  const [announceData, setAnnounceData] = useState<Announcement>();
  const [token, setToken] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [commentAnnoucements, setCommentAnnoucements] = useState<
    CommentAnnoucement[]
  >([]);

  useEffect(() => {
    const fetchQuery = async () => {
      try {
        let res = await axios(
          `${process.env.NEXT_PUBLIC_ENDPOINT}`.concat(
            '/announcement/' + `${params.id}`
          ),
          {
            headers: {
              Authorization: `Bearer ${session.data?.token}`,
            },
          }
        );
        setAnnounceData(res.data);
        setCommentAnnoucements(res.data?.CommentAnnoucements!);
      } catch (e) {}
    };
    if (session.status === 'authenticated') {
      setToken(session.data.token!);
      fetchQuery();
    }
  }, [session, params, token, refresh]);
  let addComment = async (description: string) => {
    try {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_ENDPOINT}`.concat('/comments-announce'),
          {
            annoucementId: announceData?.id!,
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
          `${process.env.NEXT_PUBLIC_ENDPOINT}/comments-announce/${commentId}`,
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
    <div className='px-3 pt-10'>
      <DetailCard
        icon={false}
        topic={announceData?.title!}
        date={new Date(announceData?.createAt!).toString()}
        detail={announceData?.description}
        dueDate={undefined}
        files={announceData?.AnnouncementFiles}
      />
      <CommentCard
        data={commentAnnoucements}
        addComment={addComment}
        deleteComment={deleteComment}
        userId={session.data?.user.id}
      />
    </div>
  );
};

export default Announcement;
