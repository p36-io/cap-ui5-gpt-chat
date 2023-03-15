namespace ChatService.types;

type Sender : String enum {
    AI = 'AI';
}

type Model {
    id       : String;
    category : String;
}

type Completion {
    message : LargeString;
}
