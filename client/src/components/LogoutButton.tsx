'use client';

import { signOut } from 'next-auth/react';
import Image from 'next/image';

type Props = {
  route: any;
};
const LogoutButton = (props: Props) => {
  const logout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: 'https://projectmanagement.bxdman.com',
    });
  };
  return (
    <button
      className='nav-btn group flex flex-row justify-between rounded-[8px] duration-300 hover:bg-[#EEF1F4]'
      id={props.route.route}
      onClick={logout}
    >
      <div className='flex gap-[24px]'>
        <Image alt='' src={props.route.icon} width={20} height={20}></Image>
        <div className='text-[16px] font-[400] text-[#545F71] duration-300 group-hover:font-[600]'>
          {props.route.name}
        </div>
      </div>
      <Image
        alt=''
        src={'/assets/Navbar/chevron-right.svg'}
        width={20}
        height={20}
      ></Image>
    </button>
  );
};

export default LogoutButton;
