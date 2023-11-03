'use client';
import AssignCard from './AssignCard';
import './styles.css';
import React, { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Assignments } from '@/interfaces/assign.interface';

type Props = {
  currentPage: number;
  setPageCount: (pageCount: number) => void;
  searchTerm: string;
};

const AssignList = ({ currentPage, setPageCount, searchTerm }: Props) => {
  const session = useSession();
  const token = session.data?.token;
  const [refresh, setRefresh] = useState(false);
  const [assignmentsData, setAssignmentsData] = useState<Assignments[]>([]);
  const [filteredAssignList, setfilteredAssignList] = useState<Assignments[]>(
    []
  );

  useEffect(() => {
    if (assignmentsData?.length > 0) {
      setfilteredAssignList(
        assignmentsData?.filter((item) => {
          return item.title.toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }
  }, [searchTerm, assignmentsData]);
  useEffect(() => {
    const fetch = async () => {
      try {
        let res = await axios(
          `${process.env.NEXT_PUBLIC_ENDPOINT}`.concat(
            `/assignment/?page=${currentPage}`
          ),
          {
            headers: {
              Authorization: `Bearer ${session.data?.token}`,
            },
          }
        );
        setAssignmentsData(res.data.data);
        setPageCount(res.data.meta.lastPage);
      } catch (e) {}
    };
    if (session.status === 'authenticated') {
      fetch();
    }
  }, [currentPage, session.status, setPageCount, session.data?.token, refresh]);

  const deleteAssign = async (assignId: string) => {
    try {
      axios
        .delete(`${process.env.NEXT_PUBLIC_ENDPOINT}/assignment/${assignId}`, {
          headers: {
            Authorization: `Bearer ${session.data?.token}`,
          },
        })
        .then((response) => {
          setRefresh(true);
        });
    } catch (e) {}
  };

  return (
    <div className={`AssignLayout`}>
      {filteredAssignList?.map((items, index) => (
        <AssignCard
          key={index}
          id={items.id}
          topic={items?.title}
          name={items.Users.email}
          status={0}
          deadline={new Date(items.dueAt)}
          deleteAssign={deleteAssign}
        />
      ))}
    </div>
  );
};

export default AssignList;
