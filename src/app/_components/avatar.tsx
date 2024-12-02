import Link from "next/link";

type Props = {
  name: string;
  picture: string;
};

const Avatar = () => {
  return (
    <Link href="https://timgu.me" className={"text-black dark:text-gray-200"}>
    <div className="flex items-center px-4">
      <img src={"/assets/blog/avatar/tim.jpeg"} className="w-12 h-12 rounded-full mr-4" alt="Tim Gu" />
      <div className="text-xl font-bold">Tim Gu</div>
    </div>
    </Link>
  );
};

export default Avatar;
