import { Component } from '@angular/core';
import { ChatService } from "./chat.service";
import { Message } from "./chat.types";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.sass'
})
export class ChatComponent {
  messages: Message[] = [];
  sessionId: number | string | undefined;
  dummyMessages: Message[] = [{ id: 1, text: 'Hello', userId: 1 }, { id: 2, text: 'Hi', userId: 2 }];

  constructor(private readonly service: ChatService) {
    this.createChatSessionIfNotExists().then(session => {
      this.sessionId = session.id;
      return this.service.getChatMessages(session.id);
    }).then(messages => {
      this.messages = messages;
    });

    setInterval(() => this.updateChatMessages(), 5000);
  }

  async createChatSession() {
    const alice = await this.service.registerUser('Alice');
    const bob = await this.service.registerUser('Bob');
    return await this.service.createChatSession([alice.id, bob.id]);
  }

  async createChatSessionIfNotExists() {
    const sessions = await this.service.getChatSessions();
    if (sessions.length === 0) {
      return this.createChatSession();
    }
    return sessions[0];
  }

  async updateChatMessages() {
    if (this.sessionId) {
      this.messages = await this.service.getChatMessages(this.sessionId);
    }
  }

  trackMessage(index: number, message: Message) {
    return message.id;
  }
}
