import fabriLogo from '@/assets/logo-fabri.png';
import { Button } from './ui/button';
const Header = () => {
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn_QR');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-fit w-full items-center justify-between border-2 p-4 pr-8">
      <div className="flex items-center gap-4">
        <img
          src={fabriLogo}
          alt="logo"
          className="h-[6rem] w-[6rem] rounded-xl"
        />
        <h1 className="text-4xl font-bold">FabriCare</h1>
      </div>

      <div className="flex">
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
      </div>

      {/* <Button onClick={handleLogout}>Logout</Button> */}
    </div>
  );
};

export default Header;
