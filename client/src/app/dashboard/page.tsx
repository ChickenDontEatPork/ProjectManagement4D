import { redirect } from 'next/navigation';

const Dashboard = async () => {
  redirect('/dashboard/stream');
};

export default Dashboard;
