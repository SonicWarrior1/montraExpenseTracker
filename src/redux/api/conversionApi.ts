import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const convertApi = createApi({
    reducerPath: 'convert',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/' }),
    endpoints: (builder) => ({
        getUsdConversion: builder.query({
            query: () => 'usd.json'
        })
    })
})
export const { useGetUsdConversionQuery } = convertApi;