export enum Sender {
  AI = "AI",
  HUMAN = "Human",
}

export interface IPersonalities {
  ID: string;
  createdAt?: Date;
  createdBy?: string;
  modifiedAt?: Date;
  modifiedBy?: string;
  name: string;
  instructions: string;
}

export interface IChats {
  ID: string;
  createdAt?: Date;
  createdBy?: string;
  modifiedAt?: Date;
  modifiedBy?: string;
  topic: string;
  model: string;
  streamingEnabled?: boolean;
  personality?: IPersonalities;
  personality_ID?: string;
  messages: IMessages[];
}

export interface IMessages {
  ID: string;
  createdAt?: Date;
  createdBy?: string;
  modifiedAt?: Date;
  modifiedBy?: string;
  text: string;
  model: string;
  sender: string;
  chat?: IChats;
  chat_ID?: string;
}

export enum Entity {
  Personalities = "p36.capui5gpt.chat.Personalities",
  Chats = "p36.capui5gpt.chat.Chats",
  Messages = "p36.capui5gpt.chat.Messages",
}

export enum SanitizedEntity {
  Personalities = "Personalities",
  Chats = "Chats",
  Messages = "Messages",
}
