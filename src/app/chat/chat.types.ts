export interface User {
  id: string | number;
  name: string;
}

export interface Message {
  id: string | number;
  text: string;
  userId: string | number;
}

export interface Chat {
  id: string | number;
  users: User[];
  messages: Message[];
}
