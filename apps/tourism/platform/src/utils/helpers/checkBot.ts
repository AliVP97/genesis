import { agentPattern } from 'utils/static/botAgent';

export const checkBotAgent = (userAgent: string) => {
  const status = agentPattern.some((item) => {
    const re = new RegExp(item.pattern);
    return re.test(userAgent);
  });

  return status;
};
