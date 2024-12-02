type Props = {
  children?: React.ReactNode;
};

const Container = ({ children }: Props) => {
return <div className="container mx-auto md:max-w-4xl max-w-md">{children}</div>;
};

export default Container;
