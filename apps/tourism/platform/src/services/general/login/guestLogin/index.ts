import API from 'utils/routes/api';
import request from 'services/axios';

export const getGuestToken = async () => {
  try {
    const { data } = await request.post(
      API.AUTH_LOGIN,
      { username: 'guest', password: 'guest' },
      { headers: { client: 'web' } },
    );
    return data;
  } catch (error) {
    throw new Error('Guest Login Failed.');
  }
};
