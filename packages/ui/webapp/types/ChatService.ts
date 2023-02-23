export enum Sender {
  AI = "AI",
}

export interface IModel {
  id: string;
}

export interface ICompletion {
  message: string;
}

export interface IChats {
  ID: string;
  createdAt?: Date;
  createdBy?: string;
  modifiedAt?: Date;
  modifiedBy?: string;
  topic: string;
  model: string;
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

export interface IPersonalities {
  ID: string;
  createdAt?: Date;
  createdBy?: string;
  modifiedAt?: Date;
  modifiedBy?: string;
  name: string;
  instructions: string;
}

export enum FuncGetModels {
  name = "getModels",
}

export type FuncGetModelsReturn = IModel[];

export enum FuncGetCompletion {
  name = "getCompletion",
  paramModel = "model",
  paramPersonality = "personality",
  paramChat = "chat",
}

export interface IFuncGetCompletionParams {
  model: string;
  personality: string;
  chat: string;
}

export type FuncGetCompletionReturn = ICompletion;

export enum Entity {
  Model = "ChatService.Model",
  Completion = "ChatService.Completion",
  Chats = "ChatService.Chats",
  Messages = "ChatService.Messages",
  Personalities = "ChatService.Personalities",
}

export enum SanitizedEntity {
  Model = "Model",
  Completion = "Completion",
  Chats = "Chats",
  Messages = "Messages",
  Personalities = "Personalities",
}
