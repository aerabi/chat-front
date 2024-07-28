import { Injectable } from '@angular/core';
import { Message, Session, User } from './chat.types';
import axios from "axios";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor() {
  }

  async registerUser(name: string): Promise<User> {
    const data = { name };
    const response = await axios.post<User>(`/users`, data);
    return response.data;
  }

  async createChatSession<T=number>(userIds: T[]): Promise<Session> {
    const data = { userIds };
    const response = await axios.post<Session>('/sessions', data);
    return response.data;
  }

  async getChatSessions(): Promise<Session[]> {
    const response = await axios.get<Session[]>('/sessions');
    return response.data;
  }

  async getChatMessages(chatId: number | string): Promise<Message[]> {
    const response = await axios.get<Message[]>(`/sessions/${chatId}/messages`);
    return response.data;
  }
}
