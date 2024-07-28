import { Component } from '@angular/core';
import { ChatService } from "./chat.service";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.sass'
})
export class ChatComponent {
  constructor(private readonly service: ChatService) {}

  async registerUser(name: string) {
    const user = await this.service.registerUser(name);
    console.log(user);
  }
}
