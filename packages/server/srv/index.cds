using {p36.capui5gpt.chat as chat} from '../db/model';
using ChatService.types as types from './types';

@requires: 'human'
service ChatService {

    function getModels()                                                                returns array of types.Model;
    function getCompletion(model : String, personality : String, chat : String)         returns types.Completion;
    function getCompletionAsStream(model : String, personality : String, chat : String) returns Binary;
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

// This only works on SAP HANA
// @see: https://cap.cloud.sap/docs/guides/authorization#association-paths
// annotate Messages with @(restrict: [{
//     grant: [
//         'WRITE',
//         'READ',
//         'UPDATE',
//         'DELETE'
//     ],
//     to   : 'human',
//     where: 'chat.createdBy = $user'
// }]);

}
