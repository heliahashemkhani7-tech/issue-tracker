import Link from "next/link";
import { FaBug } from "react-icons/fa";

export const NavBar = () => {
  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "issues" },
  ];
  return (
    <nav className="flex space-x-6 border-b mb-5 px-5 h-14 items-center">
      <Link href="/">
        <FaBug />
      </Link>
      <ul className="flex space-x-3">
        {links.map((link) => (
          <li>
            <Link
            key={link.href}
              className="text-zinc-500 hover:text-zinc-800 transition-all"
              href={link.label}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
