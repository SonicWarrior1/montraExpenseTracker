import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const convertApi = createApi({
  reducerPath: 'convert',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://cdn.jsdelivr.net/npm/@fawazahmed0',
  }),
  endpoints: builder => ({
    getUsdConversion: builder.query({
      query: ({date}) => {
        return `/currency-api@${date}/v1/currencies/usd.json`;
      },
    }),
  }),
});

export const {useGetUsdConversionQuery} = convertApi;
