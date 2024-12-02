import Link from "next/link";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  slug: string;
};

export function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  slug,
}: Props) {
  return (
    <div>
      <div className="mb-5">
        <CoverImage slug={slug} title={title} src={coverImage} />
      </div>
      <h3 className="md:text-3xl text-xl mb-3 leading-snug">
        <Link href={`/posts/${slug}`} className="hover:underline text-black dark:text-gray-200">
          {title}
        </Link>
      </h3>
      <div className="text-md md:text-lg mb-4">
        <DateFormatter dateString={date} />
      </div>
      <p className="text-md md:text-lg leading-relaxed mb-4">{excerpt}</p>
    </div>
  );
}
