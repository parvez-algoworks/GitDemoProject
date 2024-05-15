trigger ContentDocumentLinkTrigger on ContentDocumentLink (before insert,after insert) {
   if(Trigger.isBefore)
   {
       for(ContentDocumentLink cont : Trigger.new)
       {
           cont.Visibility = 'AllUsers';
           cont.ShareType = 'I';
       }
   }
}