import { CMS_NAME } from "@/lib/constants";
import Avatar from "./avatar";

export function Intro() {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight md:pr-8">
        {">"} <u>Hi👋! Welcome to my blog!</u>
      </h1>
      {/* <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
        A place where I rant. A lot
      </h4> */}
      <Avatar/>
    </section>
  );
}
