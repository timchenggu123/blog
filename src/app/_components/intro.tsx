import { CMS_NAME } from "@/lib/constants";
import Avatar from "./avatar";

export function Intro() {
  return (
    <section className="flex-row">
      <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-8 md:mb-6">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight md:pr-8">
          {">"} <u>Hi👋! Welcome to my blog!</u>
        </h1>
        {/* <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
          A place where I rant. A lot
        </h4> */}
        <Avatar/>
      </section>
      <p className="text-center md:text-left text-lg mb-16 md:mb-12">
          <b>About me</b>: I am a software engineer who loves tech, games, and photography. This is my personal blog where I write about random thoughts. It is mainly going to be tech stuff, but I might throw in some random things as well. Enjoy! 🚀
      </p>
    </section>
  );
}
