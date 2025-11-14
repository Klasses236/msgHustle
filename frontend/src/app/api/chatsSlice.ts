import { apiSlice } from './apiSlice';

interface JoinChatRequest {
  username: string;
  chatKey: string;
}

interface JoinChatResponse {
  userId: string;
  chatId: string;
}

interface Chat {
  id: string;
  name: string;
}

export const chatsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserChats: builder.query<Chat[], void>({
      query: () => '/chats',
      providesTags: ['Chats'],
    }),
    joinChat: builder.mutation<JoinChatResponse, JoinChatRequest>({
      query: (body) => ({
        url: '/chats',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Chats'],
    }),
    leaveChat: builder.mutation<{ message: string }, string>({
      query: (chatId) => ({
        url: `/chats/${chatId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Chats'],
    }),
  }),
});

export const {
  useGetUserChatsQuery,
  useJoinChatMutation,
  useLeaveChatMutation,
} = chatsApi;
