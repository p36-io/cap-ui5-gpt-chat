using {p36.capui5gpt.chat as chat} from '../db/model';

@requires: 'human'
service ChatService {

    type Model {
        id : String;
    }

    type Completion {
        message : LargeString;
    }

    function getModels()                                                        returns array of Model;
    function getCompletion(model : String, personality : String, chat : String) returns Completion;
    entity Chats         as projection on chat.Chats;
    entity Messages      as projection on chat.Messages;
    entity Personalities as projection on chat.Personalities;

    annotate Chats with @(restrict: [
        {
            grant: 'WRITE',
            to   : 'human'
        },
        {
            grant: [
                'READ',
                'UPDATE',
                'DELETE'
            ],
            to   : 'human',
            where: 'createdBy = $user'
        }
    ]);

}
