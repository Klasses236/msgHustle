import { apiSlice } from './apiSlice';
import socket from './socket';

interface Message {
  id: string;
  senderId: string;
  senderUsername: string;
  content: string;
  timestamp: string;
}

interface SendMessageRequest {
  chatId: string;
  senderId: string;
  content: string;
}

export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<Message[], string>({
      query: (chatId) => `/messages?chatId=${encodeURIComponent(chatId)}`,
      providesTags: (_result, _error, chatId) => [{ type: 'Messages', id: chatId }],
      async onCacheEntryAdded(
        chatId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          await cacheDataLoaded;

          const handleNewMessage = (data: { chatId: string; message: Message }) => {
            if (data.chatId === chatId) {
              updateCachedData((draft) => {
                draft.push(data.message);
              });
            }
          };

          socket.on('newMessage', handleNewMessage);

          await cacheEntryRemoved;
          socket.off('newMessage', handleNewMessage);
        } catch {
          // if cacheEntryRemoved resolved before cacheDataLoaded,
          // cacheDataLoaded throws
        }
      },
    }),
    sendMessage: builder.mutation<Message, SendMessageRequest>({
      query: (body) => ({
        url: '/messages',
        method: 'POST',
        body,
      }),
      // После отправки сообщения инвалидируем кэш для getMessages
      invalidatesTags: (_result, _error, { chatId }) => [{ type: 'Messages', id: chatId }],
    }),
  }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = messagesApi;