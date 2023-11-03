import { getServerSession } from 'next-auth';
import { options } from './api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';

const Home = async () => {
  const session = await getServerSession(options);
  console.log(session);

  if (!session) redirect('/login');
  if (session.user.role == 'PROCTOR') {
    redirect('/dashboard/stream');
  } else if (session.user.role == 'STUDENT') {
    redirect('/student/stream');
  }
};

export default Home;
