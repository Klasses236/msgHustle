import { apiSlice } from './apiSlice';

interface ReleaseNews {
  id: string;
  title: string;
  content: string;
  date: string;
}

export const newsSlice = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getReleaseNews: builder.query<ReleaseNews[], void>({
      query: () => '/news/releases',
    }),
  }),
});

export const { useGetReleaseNewsQuery } = newsSlice;
