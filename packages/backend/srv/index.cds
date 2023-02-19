using {p36.capui5gpt.chat as chat} from '../db/model';

service ChatService {

    // Actions
    type Model {
        id : String;
    }

    type Completion {
        message : LargeString;
    }

    function getModels() returns array of Model;

    entity Chats         as projection on chat.Chats actions {
        function getCompletion(model : String, personality : String) returns Completion;
    };

    entity Messages      as projection on chat.Messages;
    entity Personalities as projection on chat.Personalities;

}
