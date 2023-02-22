using {
    cuid,
    managed,
    User
} from '@sap/cds/common';

namespace p36.capui5gpt.chat;

entity Personalities : cuid, managed {
    name         : String;
    instructions : String;
}

entity Chats : cuid, managed {
    topic       : String;
    model       : String;
    personality : Association to one Personalities;
    messages    : Composition of many Messages
                      on messages.chat = $self;
}

entity Messages : cuid, managed {
    text   : LargeString;
    model  : String;
    sender : User;
    chat   : Association to one Chats;
}
