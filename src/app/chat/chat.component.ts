import { Component } from '@angular/core';
import { ChatService } from "./chat.service";
import { Message, Session } from "./chat.types";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButton } from "@angular/material/button";
import { MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButton, MatFormField, MatInput, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.sass'
})
export class ChatComponent {
  messages: Message[] = [];
  session: Session | undefined;
  sessionId: number | string | undefined;
  userNames: { [key: string | number]: string } = {};
  messageText: string = '';

  constructor(private readonly service: ChatService) {
    this.createChatSessionIfNotExists().then(session => {
      this.session = session;
      this.sessionId = session.id;
      return this.getUserNames();
    }).then(() => {
      return this.service.getChatMessages(this.sessionId!);
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

  async getUserNames() {
    const userIds = this.session?.userIds || [];
    for (const userId of userIds) {
      if (!this.userNames[userId]) {
        const user = await this.service.getUser(userId);
        this.userNames[userId] = user.name;
      }
    }
  }

  async updateChatMessages() {
    if (this.sessionId) {
      this.messages = (await this.service.getChatMessages(this.sessionId)).map(message => {
        return {
          ...message,
          userName: this.userNames[message.userId]
        };
      })
    }
  }

  trackMessage(index: number, message: Message) {
    return message.id;
  }

  async sendMessage() {
    if (this.messageText && this.sessionId) {
      const message = {
        text: this.messageText,
        userId: this.session?.userIds[0] || 0
      };
      await this.service.addMessage(this.sessionId, message);
      this.messageText = '';
      return this.updateChatMessages();
    }
  }
}
