'use client';
import AssignCard from './AssignCard';
import './styles.css';
import React, { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';
import axios from 'axios';
import {
  AssignmentSubmit,
  Assignments,
} from '@/interfaces/assignment.interface';

type Props = {
  currentPage: number;
  setPageCount: (pageCount: number) => void;
  searchTerm: string;
};

const AssignList = ({ currentPage, setPageCount, searchTerm }: Props) => {
  const session = useSession();
  const [refresh, setRefresh] = useState(false);
  const [assignmentsData, setAssignmentsData] = useState<Assignments[]>([]);
  // const [filteredAssignList, setfilteredAssignList] = useState<Assignments[]>(
  //   []
  // );

  useEffect(() => {
    const fetch = async () => {
      try {
        let res = await axios(
          `${process.env.NEXT_PUBLIC_ENDPOINT}`.concat(
            `/assignment/proctor/group`
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
  }, [session, session.data?.token, setPageCount]);

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
      {assignmentsData?.map((items, index) => (
        <AssignCard
          key={index}
          id={'items.id'}
          topic={'items'}
          name={'items'}
          status={0}
          deadline={new Date()}
        />
      ))}
    </div>
  );
};

export default AssignList;
