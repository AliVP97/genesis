import { useMutation, useQuery } from 'react-query';
import { TCalculateScoreBody, calculateScore, getScore } from 'services/club';

const useClubChance = () => {
  const { data } = useQuery('club-score', getScore);

  const { mutate: mutateUserChance, isLoading } = useMutation((data: TCalculateScoreBody) =>
    calculateScore(data),
  );
  return { score: data, mutateUserChance, isLoading };
};

export default useClubChance;
