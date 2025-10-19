
import { ReactNode } from 'react';

type NavProps = {
  children: ReactNode;
};

const Nav = ({ children }: NavProps) => {
  return (
    <nav className="absolute w-full h-15 bg-amber-200 bottom-0 right-0 p-4 z-50">
      {children}
    </nav>
  );
};

export default Nav;