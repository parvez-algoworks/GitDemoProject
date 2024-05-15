public class InsightReportHandler {
    public static void checkMasterFiles(List<ContentDocumentLink> newLinks) {
        Set<Id> reportIds = new Set<Id>();
        Set<Id> contDocIds = new Set<Id>();
        system.debug('newLinks'+newLinks);
       
        for (ContentDocumentLink cdl : newLinks) {
            system.debug('newLinks size'+newLinks.size());
            string linkedId = cdl.LinkedEntityId;
            if(!linkedId.startswith('005')){
            contDocIds.add(cdl.ContentDocumentId);
            reportIds.add(cdl.LinkedEntityId);
            cdl.Visibility = 'AllUsers';
            cdl.ShareType =  'I';
            //ContentDocumentLink cdl = [select contentdocument.id, contentdocument.title, contentdocument.filetype from contentdocumentlink where linkedentityid = 'a085h00000VhBv4AAF'];
            //ContentVersion cv = [select id from contentversion where contentdocumentid = :cdl.contentdocument.id];
            
            system.debug('inside for loop');
            }
        }
     
        List<ContentDocument> contDocList = [select Title from ContentDocument where ID IN: contDocIds and Title like '%_master'];

        List<ContentDocumentLink> contDocLinks = [SELECT ContentDocument.Title FROM ContentDocumentLink WHERE LinkedEntityId = :reportIds and ContentDocument.Title like '%_master'];
        system.debug('contDocLinks.szie'+contDocLinks.size());
        if (!contDocLinks.isEmpty() || contDocList.size()>1) 
        {    
            system.debug('contDocLinks'+contDocLinks.size());
            system.debug('contDocList.size()'+contDocList.size());
             system.debug('inside if condition');
            newLinks[0].addError('Master File already exists');
        }
        List<ContentVersion> cv = [select id from contentversion where contentdocumentid IN :contDocIds and Title like '%_master'];
        if(cv.size()>0){
        ContentDistribution cd = new ContentDistribution();
            cd.Name = 'Test';
            cd.ContentVersionId = cv[0].id;
            cd.PreferencesAllowViewInBrowser= true;
            cd.PreferencesLinkLatestVersion=true;
            cd.PreferencesNotifyOnVisit=false;
            cd.PreferencesPasswordRequired=false;
            cd.PreferencesAllowOriginalDownload= true;
            insert cd;
            system.debug('cd'+cd);
        }
    }
}