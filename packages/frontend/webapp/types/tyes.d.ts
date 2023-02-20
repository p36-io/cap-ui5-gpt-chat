export interface IChat {
  ID: string;
  topic: string;
  model: string;
  personality_ID: string;
}

export interface IChatMessage {
  text: string;
  model: string;
  sender?: string;
  chat_ID: string;
}
