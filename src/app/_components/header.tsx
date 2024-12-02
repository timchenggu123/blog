import Link from "next/link";
import Avatar from "./avatar";

const Header = () => {
  return (
    <h2 className="text-2xl md:text-3xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8 flex items-center justify-between">
      <Link href="/" className="hover:underline text-black dark:text-gray-200">
      {'>'}$ ~/Blogs
      </Link>
      <Avatar/>
    </h2>
  );
};

export default Header;
