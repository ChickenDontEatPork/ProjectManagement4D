'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import AnnounceCard from './AnnounceCard';
import { useSession } from 'next-auth/react';
import { Announcement } from '@/interfaces/announce.interface';
import axios from 'axios';
type Props = {
  searchTerm: string;
  currentPage: number;
  setPageCount: (pageCount: number) => void;
};

const StreamList = ({ searchTerm, currentPage, setPageCount }: Props) => {
  const session = useSession();
  const token = session.data?.token;
  const [refresh, setRefresh] = useState(false);
  const [announcemeatsData, setAssignmentsData] = useState<Announcement[]>([]);
  const [filteredAnnoucementList, setfilteredAnnoucementList] = useState<
    Announcement[]
  >([]);

  const perPage = 5;
  const lastIndex = perPage * currentPage;
  const firstIndex = lastIndex - perPage;
  useEffect(() => {
    if (announcemeatsData.length > 0) {
      setfilteredAnnoucementList(
        announcemeatsData?.filter((item) => {
          return item.title.toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }
  }, [searchTerm, announcemeatsData]);
  useEffect(() => {
    const fetch = async () => {
      try {
        let res = await axios(
          `${process.env.NEXT_PUBLIC_ENDPOINT}`.concat(
            `/announcement?page=${currentPage}`
          ),
          {
            headers: {
              Authorization: `Bearer ${session.data?.token}`,
            },
          }
        );
        setAssignmentsData(res.data.data);
        setPageCount(res.data.meta.lastPage);
        // console.log(filteredAnnoucementList);
      } catch (e) {}
    };
    if (session.status === 'authenticated') {
      fetch();
    }
  }, [currentPage, session.status, setPageCount, session.data?.token, refresh]);

  const deleteAnnounce = async (announceId: string) => {
    try {
      axios
        .delete(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/announcement/${announceId}`,
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
    <div className={`AssignLayout`}>
      {filteredAnnoucementList.map((items, index) => (
        <AnnounceCard
          key={index}
          id={items.id}
          topic={items.title}
          date={new Date(items.createAt)}
          detail={items.description}
          deleteAnnounce={deleteAnnounce}
        />
      ))}
    </div>
  );
};

export default StreamList;
