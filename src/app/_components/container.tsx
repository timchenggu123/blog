type Props = {
  children?: React.ReactNode;
};

const Container = ({ children }: Props) => {
return <div className="container mx-auto lg:px-60 sm:px-5">{children}</div>;
};

export default Container;
