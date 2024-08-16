import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import Reports from '@/pages/Reports';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Root = () => {
  const params = useLocation();

  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn_QR');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };
  return (
    <div className="flex h-dvh w-dvw items-center justify-center overflow-y-hidden">
      <div className="mx-auto flex h-full w-full gap-4">
        <div className="relative flex h-screen w-[250px] flex-col border-r-[1px] p-2 pt-[4rem]">
          <Link
            className={`p-2 hover:text-red-500 ${params.pathname === '/' ? 'bg-orange-500 text-white' : ''}`}
            to="/"
          >
     Reports
          </Link>

          <Link
            className={`p-2 hover:text-red-500 ${params.pathname === '/feedbacks' ? 'bg-orange-500 text-white' : ''}`}
            to="/feedbacks"
          >
    Feedbacks
          </Link>
          <Link
            className={`p-2 hover:text-red-500 ${params.pathname === '/users' ? 'bg-orange-500 text-white' : ''}`}
            to="/users"
          >
            Users
          </Link>
          <Link
            className={`p-2 hover:text-red-500 ${params.pathname === '/Reports' ? 'bg-orange-500 text-white' : ''}`}
            to="/Reports"
          >
            Reports
          </Link>


          <Button
            onClick={handleLogout}
            className="absolute bottom-2 left-2 right-2"
          >
            Logout
          </Button>
        </div>

        <div className="h-full w-full">
          {/* This is where the child routes get rendered */}
          {params.pathname === '/' ? <Reports /> : <Outlet />}
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default Root;