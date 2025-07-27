import axios from 'axios';
import API from 'utils/routes/api';
import { TTourismLandingContents } from './interface';

export const getTourismLandingContents = async () => {
  const { data }: { data: TTourismLandingContents } = await axios.get(
    `${process.env.NEXT_PUBLIC_CMS_DOMAIN}${API.CMS.GET_TOURISM_LANDING_CONTENTS}`,
  );
  return data;
};
