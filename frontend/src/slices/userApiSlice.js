import { ADMIN_URL, PASSWORD_URL, USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";
import { setUser, logout, setCredentials } from "./authSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (loginData) => {
        return {
          url: `${USERS_URL}/login`,
          method: "POST",
          body: loginData,
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data?.token));
          dispatch(setUser(data?.user));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    googleLogin: builder.mutation({
      query: (googleLoginInfo) => {
        return {
          url: `${USERS_URL}/googleLogin`,
          method: "POST",
          body: {
            code: googleLoginInfo.code,
          },
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data?.token));
          dispatch(setUser(data?.user));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    register: builder.mutation({
      query: (userData) => {
        return {
          url: `${USERS_URL}/register`,
          method: "POST",
          body: userData,
          formData: true,
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data?.token));
          dispatch(setUser(data?.user));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    loadUser: builder.query({
      query: () => {
        return {
          url: `${USERS_URL}/me`,
          method: "GET",
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) dispatch(setUser(data?.user));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    updateProfile: builder.mutation({
      query: (userData) => {
        return {
          url: `${USERS_URL}/me/update`,
          method: "PUT",
          body: userData,
          formData: true,
        };
      },
    }),
    updatePassword: builder.mutation({
      query: (passwords) => {
        return {
          url: `${PASSWORD_URL}/update`,
          method: "PUT",
          body: passwords,
          formData: true,
        };
      },
    }),
    forgotPassword: builder.mutation({
      query: (email) => {
        return {
          url: `${PASSWORD_URL}/forgotPassword`,
          method: "POST",
          body: email,
          formData: true,
        };
      },
    }),
    resetPassword: builder.mutation({
      query: (resetData) => {
        const { token, formData: passwords } = resetData;
        return {
          url: `${PASSWORD_URL}/resetPassword/${token}`,
          method: "PATCH",
          body: passwords,
          formData: true,
        };
      },
    }),
    logOut: builder.mutation({
      query: () => {
        return {
          url: `${USERS_URL}/logout`,
          method: "POST",
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
          dispatch(apiSlice.util.resetApiState());
        } catch (err) {
          console.log(err);
        }
      },
    }),
    //Admin
    getAllUsers: builder.query({
      query: () => {
        return {
          url: `${ADMIN_URL}/users`,
          method: "GET",
        };
      },
      providesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: (data) => {
        const { userId, formData: userData } = data;
        return {
          url: `${ADMIN_URL}/user/${userId}`,
          method: "PUT",
          body: userData,
        };
      },
      invalidatesTags: ["Users", "User"],
    }),
    getUserDetails: builder.query({
      query: (id) => {
        return {
          url: `${ADMIN_URL}/user/${id}`,
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => {
        return {
          url: `${ADMIN_URL}/user/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGoogleLoginMutation,
  useRegisterMutation,
  useLoadUserQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogOutMutation,
  useGetAllUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;
