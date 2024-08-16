import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import Reports from '@/pages/Reports';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Root = () => {
  const params = useLocation();

  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex h-full w-dvw flex-col justify-center overflow-y-hidden">
      <Header />
      <div className="mx-auto flex h-screen w-full flex-col bg-gray-300">
        <div className="relative flex h-[6rem] w-full flex-row items-center gap-8 p-4">
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
        </div>

        <div className="flex h-full w-full items-start justify-center">
          <div className="h-[80%] w-[90%] rounded-xl bg-white p-4">
            {params.pathname === '/' ? <Reports /> : <Outlet />}
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default Root;