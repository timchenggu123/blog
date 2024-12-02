type Props = {
  children?: React.ReactNode;
};

const Container = ({ children }: Props) => {
return <div className="container mx-auto md:max-w-4xl max-w-md md:p-0 p-4">{children}</div>;
};

export default Container;
