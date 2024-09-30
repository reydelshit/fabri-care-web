import fabriLogo from '@/assets/logo-fabri.png';
import { Button } from './ui/button';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import moment from 'moment';

interface Notification {
  notification_id: number;
  notification_message: string;
  created_at: string;
}

const Header = () => {
  const [notification, setNotification] = useState<Notification[]>([]);
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn_FabriCare');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  const fetchNotification = () => {
    axios
      .get(`${import.meta.env.VITE_SERVER_LINK}/notification.php`)
      .then((res) => {
        console.log(res.data);

        const ORDERBYLATEST = res.data.sort(
          (a: Notification, b: Notification): number => {
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          },
        );

        setNotification(ORDERBYLATEST);
      });
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  return (
    <div className="flex h-fit w-full items-center justify-between border-2 p-4 pr-8">
      <div className="flex items-center gap-4">
        <Link className="flex items-center gap-4" to="/">
          <img
            src={fabriLogo}
            alt="logo"
            className="h-[6rem] w-[6rem] rounded-xl"
          />
          <h1 className="border-b-8 border-[#DEAC80] text-4xl font-bold">
            FabriCare
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex items-center">
          <span className="absolute right-2 top-0 block h-[0.8rem] w-[0.8rem] rounded-full bg-red-500"></span>

          <Popover>
            <PopoverTrigger>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-12 cursor-pointer"
                color="#DEAC80"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </PopoverTrigger>
            <PopoverContent className="mr-[5rem] w-[25rem]">
              <div className="flex h-[15rem] max-h-[15rem] w-full flex-col gap-4 overflow-x-hidden overflow-y-scroll">
                {notification.length > 0 ? (
                  notification.map((notif, index) => {
                    return (
                      <span key={index} className="w-full border-b-2 p-2">
                        <p className="w-full text-wrap break-words font-semibold text-black">
                          {notif.notification_message}
                        </p>

                        <span className="text-gray-600">
                          {moment(notif.created_at).format('LL')}
                        </span>
                      </span>
                    );
                  })
                ) : (
                  <span className="w-full text-center text-gray-400">
                    No Notification
                  </span>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <Popover>
          <PopoverTrigger>
            {' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              color="#DEAC80"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-12 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-4 p-4">
              <Button className="hover:bg-[#DEAC80]" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* <Button onClick={handleLogout}>Logout</Button> */}
    </div>
  );
};

export default Header;
