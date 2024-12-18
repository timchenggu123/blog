import Container from "@/app/_components/container";
import { EXAMPLE_PATH } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 dark:bg-zinc-900">
      <Container>
        <div className="py-28 flex flex-col lg:flex-row items-center">
          <h3 className="text-4xl lg:text-[2.5rem] font-bold tracking-tighter leading-tight text-center lg:text-left mb-10 lg:mb-0 lg:pr-4 lg:w-1/2">
            Learn more about me?
          </h3>
          <div className="flex flex-col lg:flex-row justify-center items-center lg:pl-4 lg:w-1/2">
            <a
              href={"https://timgu.me/#contact"}
              className="mx-3 bg-blue-500 hover:bg-white hover:text-black border border-blue-300 border-2 text-white font-bold rounded-3xl py-3 px-12 lg:px-8 duration-200 transition-colors mb-6 lg:mb-0"
            >
              Contact
            </a>
            <a
              href={"https://timgu.me"}
              className="mx-3 font-bold hover:underline"
            >
              E-portfolio
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
