import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BACKEND_URL}/api/auth`,
        credentials: 'include'
    }),

    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (user) => ({
                url: '/signup',
                method: 'POST',
                body: user
            })
        }),
        login: builder.mutation({
            query: (user) => ({
                url: '/login',
                method: 'POST',
                body: user
            })
        }),
        verifyAccount: builder.mutation({
            query: ({ otp, email }) => ({
                url: "/verify-otp",
                method: 'POST',
                body: { otp, email }
            })
        }),
        myProfile: builder.query({
            query: () => ({
                url: "/my-profile",
                method: 'GET'
            })
        }),

        logout: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "POST"
            })
        })
    })
})

export const { useLoginMutation, useSignupMutation, useVerifyAccountMutation, useMyProfileQuery ,useLogoutMutation} = authApi;