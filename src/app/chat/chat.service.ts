import { Injectable } from '@angular/core';
import { Message, Session, User } from './chat.types';
import axios from "axios";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private users: Record<number | string, User> = {};

  constructor() {
  }

  async registerUser(name: string): Promise<User> {
    const data = { name };
    const response = await axios.post<User>(`/users`, data);
    return response.data;
  }

  async getAllUsers(): Promise<User[]> {
    const response = await axios.get<User[]>('/users');
    return response.data;
  }

  async getUser<T extends string|number=number>(userId: T): Promise<User> {
    if (!this.users[userId]) {
      const allUsers = await this.getAllUsers();
      allUsers.forEach(user => this.users[user.id] = user);
    }
    return this.users[userId];
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

  async addMessage(chatId: number | string, message: Omit<Message, 'id'>): Promise<void> {
    await axios.post(`/sessions/${chatId}/messages`, message);
  }
}
