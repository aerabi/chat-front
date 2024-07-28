import { Injectable } from '@angular/core';
import { Chat, Message, User } from './chat.types';
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
}
