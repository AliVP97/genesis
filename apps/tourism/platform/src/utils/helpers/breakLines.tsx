const breakLines = (text: string): JSX.Element[] => {
  const element = text?.split('\n').map((line, index) => (
    <span key={index}>
      {line}
      <br />
    </span>
  ));
  return element;
};

export { breakLines };
