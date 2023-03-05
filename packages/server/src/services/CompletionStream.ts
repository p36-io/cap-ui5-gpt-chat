import { TypedEmitter } from "tiny-typed-emitter";

interface CompletionStreamEvents {
  chunk: (content: string) => void;
  error: (error: any) => void;
  end: () => void;
}

export default class CompletionStream extends TypedEmitter<CompletionStreamEvents> {
  constructor() {
    super();
  }
}
