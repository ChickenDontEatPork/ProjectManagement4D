type Props = {};

const Tabs = ({
  page,
  setPage,
}: {
  page: string;
  setPage: (tabs: string) => void;
}) => {
  return (
    <div className='flex w-full flex-col'>
      <div className='flex w-full justify-center space-x-5 text-xl md:justify-normal '>
        <div
          onClick={() => setPage('stream')}
          className='group flex cursor-pointer flex-col
          justify-center'
        >
          <div className='rounded-md p-2 text-center transition-all duration-500 group-hover:bg-slate-200'>
            Announcement
          </div>
          <div
            className={
              page === 'stream'
                ? 'h-[3px] bg-slate-600 transition'
                : 'h-[3px] bg-white transition'
            }
          ></div>
        </div>

        <div
          onClick={() => setPage('assignment')}
          className='group flex cursor-pointer flex-col justify-center'
        >
          <div className='rounded-md p-2 text-center transition-all duration-500 group-hover:bg-slate-200'>
            Assignment
          </div>
          <div
            className={
              page === 'assignment'
                ? 'h-[3px] bg-slate-600 transition'
                : 'h-[3px] bg-white transition'
            }
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
