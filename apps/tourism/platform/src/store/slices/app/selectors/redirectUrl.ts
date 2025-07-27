import { RootState } from 'store';

export const selectNotFoundRedirectUrl = (state: RootState) => state.app.notFoundRedirectUrl;
