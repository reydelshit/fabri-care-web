import Logo from '@/assets/logo-fabri.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function Login() {
  const [loginDetails, setLoginDetails] = useState({
    username: '',
    password: '',
  });
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const u = `${import.meta.env.VITE_USERNAME}`;
    const p = `${import.meta.env.VITE_PASSWORD}`;

    if (!loginDetails.username || !loginDetails.password) {
      alert('Please enter username and password');
      return;
    }

    if (loginDetails.username === u && loginDetails.password === p) {
      alert('Login successful');

      localStorage.setItem('isLoggedIn_FabriCare', 'true');
      localStorage.setItem('role', 'admin');

      window.location.href = '/';

      return;
    } else {
      alert('Invalid username or password');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);

    setLoginDetails((values) => ({ ...values, [name]: value }));
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-4 text-center">
      <div className="flex h-fit w-full flex-col items-center rounded-xl border-[1px] p-4 shadow-md md:w-[30rem]">
        <img
          src={Logo}
          alt="logo"
          className="my-4 h-[10rem] w-[10rem] rounded-lg"
        />
        <h1 className="my-2 font-semibold">ADMIN</h1>

        <form
          onSubmit={handleLogin}
          className="flex w-full flex-col items-center justify-center"
        >
          <Input
            placeholder="Username"
            className="w- mb-2"
            name="username"
            onChange={handleChange}
          />
          <Input
            type="password"
            placeholder="Password"
            className="w- mb-2"
            name="password"
            onChange={handleChange}
          />
          <Button className="my-4 w-[80%] bg-[#DEAC80]" type="submit">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
