'use client';
import React from 'react';
import { useState, useEffect } from 'react';

const Filtter = ({ show }: { show: (string: string) => void }) => {
  const [filtterStatus, setFiltterStatus] = useState<string>('');

  return (
    <select
      name=''
      id='status'
      defaultValue={''}
      className=' rounded-md border border-[#9BA5B7] px-2 py-2 text-[10px]'
      onChange={(e) => show(e.target.value)}
    >
      <option value=''>Filter Status</option>
      <option value='qui est esse'>green</option>
      <option value='red'>red</option>
      <option value='gray'>gray</option>
    </select>
  );
};

export default Filtter;
