import Header from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';
import Reports from '@/pages/Reports';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';

const Root = () => {
  const params = useLocation();

  const stateLogin = localStorage.getItem('isLoggedIn_FabriCare');

  if (!stateLogin) {
    window.location.href = '/login';
  }

  return (
    <div className="h-screen overflow-x-hidden">
      <Header />

      <div className="relative flex h-[6rem] w-full flex-row items-center justify-between border-b-[1px] p-4">
        <div className="flex gap-8">
          <Link
            className={`p-2 hover:font-bold hover:text-black ${params.pathname === '/' ? 'border-b-2 border-black font-bold text-black' : ''}`}
            to="/"
          >
            Reports
          </Link>

          <Link
            className={`p-2 hover:font-bold hover:text-black ${params.pathname === '/feedbacks' ? 'border-b-2 border-black font-bold text-black' : ''}`}
            to="/feedbacks"
          >
            Feedbacks
          </Link>
          <Link
            className={`p-2 hover:font-bold hover:text-black ${params.pathname === '/users' ? 'border-b-2 border-black font-bold text-black' : ''}`}
            to="/users"
          >
            Users
          </Link>

          <Link
            className={`p-2 hover:font-bold hover:text-black ${params.pathname === '/instructions' ? 'border-b-2 border-black font-bold text-black' : ''}`}
            to="/instructions"
          >
            Instructions
          </Link>
        </div>

        <h1 className="border-b-8 border-[#DEAC80] pb-1 text-3xl font-semibold">
          {params.pathname === '/'
            ? 'Reports'
            : params.pathname === '/feedbacks'
              ? 'List of Feedbacks'
              : params.pathname === '/users'
                ? 'List of Users'
                : 'Instructions'}
        </h1>
      </div>

      <div className="flex h-full w-full items-start justify-center">
        <div className="mt-2 block h-fit w-full rounded-xl p-4">
          {params.pathname === '/' ? <Reports /> : <Outlet />}
        </div>
      </div>

      <Toaster />
      {/* <Footer /> */}
    </div>
  );
};

export default Root;
