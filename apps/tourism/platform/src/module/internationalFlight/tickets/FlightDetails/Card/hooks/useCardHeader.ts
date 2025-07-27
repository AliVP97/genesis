import { useCard } from '../CardContext';

const useCardHeader = () => {
  const { isExpand, isExpandable, setIsExpand } = useCard();

  const handleClick = () => {
    if (!isExpandable) {
      return;
    }

    setIsExpand(!isExpand);
  };

  return {
    isExpand,
    isExpandable,
    handleClick,
  };
};

export default useCardHeader;
