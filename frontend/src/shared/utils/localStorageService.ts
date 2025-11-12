interface ChatSession {
  username: string;
  userId: string;
  chatId: string;
}

const saveChatSession = (session: ChatSession): void => {
  localStorage.setItem('chatSession', JSON.stringify(session));
};

const getChatSession = (): ChatSession | null => {
  const data = localStorage.getItem('chatSession');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

const clearChatSession = (): void => {
  localStorage.removeItem('chatSession');
};

export { saveChatSession, getChatSession, clearChatSession };
export type { ChatSession };