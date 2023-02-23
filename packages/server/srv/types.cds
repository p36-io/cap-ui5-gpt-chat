namespace ChatService.types;

type Sender : String enum {
    AI = 'AI';
}

type Model {
    id : String;
}

type Completion {
    message : LargeString;
}
