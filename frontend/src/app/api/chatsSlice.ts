import { apiSlice } from './apiSlice';

interface JoinChatRequest {
  username: string;
  chatKey: string;
}

interface JoinChatResponse {
  userId: string;
  chatId: string;
}

export const chatsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    joinChat: builder.mutation<JoinChatResponse, JoinChatRequest>({
      query: (body) => ({
        url: '/chats',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useJoinChatMutation } = chatsApi;