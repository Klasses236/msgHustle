import { apiSlice } from './apiSlice';
import socket from './socket';

interface Message {
  id: string;
  senderId: string;
  senderUsername: string;
  content: string;
  timestamp: string;
}

interface GetMessagesResponse {
  items: Message[];
  totalCount: number;
}

interface GetMessagesRequest {
  chatId: string;
  offset?: number;
  limit?: number;
}

interface SendMessageRequest {
  chatId: string;
  senderId: string;
  content: string;
}

export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<GetMessagesResponse, GetMessagesRequest>({
      query: ({ chatId, offset = 0, limit = 50 }) => {
        const params = new URLSearchParams({
          chatId,
          offset: offset.toString(),
          limit: limit.toString(),
        });
        return `/messages?${params.toString()}`;
      },
      providesTags: (_result, _error, { chatId }) => [
        { type: 'Messages', id: chatId },
      ],
      serializeQueryArgs: ({ queryArgs }) => {
        return { chatId: queryArgs.chatId };
      },
      merge: (currentCache, newItems, { arg }) => {
        if ((arg.offset ?? 0) > 0) {
          // Добавляем старые сообщения в начало
          currentCache.items.unshift(...newItems.items);
        } else {
          // Заменяем для начальной загрузки
          return newItems;
        }
      },
      transformResponse: (response: GetMessagesResponse) => response,
      async onCacheEntryAdded(
        { chatId },
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          await cacheDataLoaded;

          const handleNewMessage = (data: {
            chatId: string;
            message: Message;
          }) => {
            if (data.chatId === chatId) {
              updateCachedData((draft) => {
                draft.items.push(data.message); // Новые сообщения в конец
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
      // Кэш обновляется через socket, инвалидация не нужна
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
  useSendMessageMutation,
} = messagesApi;
