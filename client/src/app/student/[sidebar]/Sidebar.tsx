'use client';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import './style.css';
import { signOut } from 'next-auth/react';
import LogoutButton from '@/components/LogoutButton';

const Sidebar = () => {
  const logout = async () => {
    await signOut();
  };
  let routing = [
    {
      name: 'Stream',
      route: '/student/stream',
      icon: '/assets/Navbar/Icon.svg',
    },
  ];
  let action = [
    {
      name: 'Settings',
      route: 'setting',
      icon: '/assets/Navbar/cog.svg',
    },
    {
      name: 'Sign Out',
      route: '/login',
      icon: '/assets/Navbar/logout.svg',
    },
  ];
  let NavButton = ({ route }: any) => {
    if (route.name == 'Sign Out') {
      return <LogoutButton route={route} key={route.route} />;
    } else {
      return (
        <Link
          className='nav-btn group flex flex-row justify-between rounded-[8px] duration-300 hover:bg-[#EEF1F4]'
          id={route.route}
          href={route.route}
          onClick={route.onclick ? route.onclick : () => {}}
        >
          <div className='flex gap-[24px]'>
            <Image alt='' src={route.icon} width={20} height={20}></Image>
            <div className='text-[16px] font-[400] text-[#545F71] duration-300 group-hover:font-[600]'>
              {route.name}
            </div>
          </div>
          <Image
            alt=''
            src={'/assets/Navbar/chevron-right.svg'}
            width={20}
            height={20}
          ></Image>
        </Link>
      );
    }
  };

  return (
    <div className='sidebar-container flex h-full flex-col justify-between border border-[#545f7167] '>
      <div className='flex flex-col'>
        {routing.map((route) => (
          <NavButton key={route.route} route={route}></NavButton>
        ))}
      </div>
      <div className=' flex flex-col'>
        {action.map((route) => (
          <NavButton key={route.route} route={route}></NavButton>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
