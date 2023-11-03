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
            `/assignment/student/group?page=${currentPage}`
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
      setRefresh(false);
    }
  }, [currentPage, session.status, setPageCount, token, refresh]);

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
        />
      ))}
    </div>
  );
};

export default AssignList;
