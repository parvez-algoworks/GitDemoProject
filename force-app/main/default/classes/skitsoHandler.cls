public without sharing class skitsoHandler {
    @AuraEnabled
    public static string getEmailforRegistration(string cal_username,string cal_password){
        try {
            contact signUpContact = [select id,email,Calendar_password__c from contact where email=:cal_username LIMIT 1];
            if(signUpContact != null)
            {
                signUpContact.Calendar_password__c = cal_password;
                Database.update(signUpContact, true);
                return 'Success';
            }
            else
            {
                return 'Failure';
            }
        }
        catch(DMLException e) {
            throw new DMLException('Unable to Perform the Operation : ' +e.getMessage());
        }    
    }
    @AuraEnabled
    public static Contact verifyUser(string cal_username,string cal_password){
        try{
            contact loginContact = [select Calendar_Username__c,Calendar_password__c,UID__c from contact where Calendar_Username__c=:cal_username AND Calendar_password__c=:cal_password LIMIT 1]; 
            if(loginContact!= null){    
                return loginContact;
            }
            else{
                return null;
            }
        }
        catch(DMLException e) {
            throw new DMLException('Unable to Perform the Operation : ' +e.getMessage());
        }    
    }
    @AuraEnabled(cacheable=true)
    public static List<Campaign> getCampaignTicker() {
        try{
            //string checkForLike = searchticker+'%';
            system.debug('get event list');
            List<campaign> campaignList = new list<campaign>();
            campaignList = [SELECT Id,Ticker__c FROM Campaign where Ticker__c!=null];
            return campaignList;
        }
        catch(DMLException e) {
            throw new DMLException('Unable to Perform the Operation : ' +e.getMessage());
        }    
    }
    @AuraEnabled(cacheable=true)
    public static List<Campaign> getCampaignList(integer offset) {
        try{
            List<campaign> campaignList = new list<campaign>();
            Contact__c rowSetting = Contact__c.getInstance();
            system.debug('rowsize'+rowSetting.rowLimit__c);
            decimal rowlimit = rowSetting.rowLimit__c;
            Integer limitSize =  Integer.valueOf(rowlimit);
            //skitso__c offsetSetting = skitso__c.getInstance();
            //system.debug('rowsize'+offsetSetting.offset__c);
            //decimal offsetDec = offsetSetting.offset__c;
            //Integer offset =  Integer.valueOf(offsetDec);
            campaignList = [SELECT Id,name,description,startdate,enddate,sector__c,Ticker__c FROM Campaign LIMIT :limitSize OFFSET :offset];
            return campaignList;
        }
        catch(DMLException e) {
            throw new DMLException('Unable to Perform the Operation : ' +e.getMessage());
        }    
    }
    @AuraEnabled
    public static string addmembertocampaign(string conid,list<string> campid){
        try{
            List<campaignmember> campMemberList = new List<campaignmember>();
            for(integer i=0; i < campid.size() ;i++){
                campaignmember cam = new campaignmember();
                cam.campaignid = campid[i];
                cam.contactid = conid;
                campMemberList.add(cam);
            }
            insert campMemberList;
            return 'Success';
        }
        catch(DMLException e) {
            throw new DMLException('Unable to Perform the Operation : ' +e.getMessage());
        }    
    }
    @AuraEnabled(cacheable=true)
    public static List<Campaign> getCampaigntoregister(list<string> campids) {
        try
        {
            List<campaign> campaignList = new list<campaign>();
            campaignList =  [SELECT Id,name,description,startdate,enddate,sector__c FROM Campaign where id IN: campids];
            return campaignList;
        }
        catch(DMLException e) {
            throw new DMLException('Unable to Perform the Operation : ' +e.getMessage());
        }       
    }
    @AuraEnabled(cacheable=true)
    public static List<Campaign> getRegisteredCampaign(string contactid) {
        try{
            list<campaign> campaignlist = new list<campaign>();
            campaignlist =  [SELECT Id,name,description,startdate,enddate,sector__c FROM Campaign WHERE Id IN (SELECT CampaignId FROM CampaignMember WHERE ContactId =:contactid)];
            system.debug('campaignlist'+campaignlist);
            return campaignlist;
        }
        catch(DMLException e) {
            throw new DMLException('Unable to Perform the Operation : ' +e.getMessage());
        }    
    }   
    @AuraEnabled
    public static String removeRegisteredCampaign(string campid,string contactidtoremove) {
        try{
            campaignmember campmem = new campaignmember();
            campmem = [select id,campaignid from campaignmember where campaignid=: campid and contactid=: contactidtoremove];
            delete campmem;
            return 'Success';
        }
        catch(DMLException e) {
            throw new DMLException('Unable to Perform the Operation : ' +e.getMessage());
        }    
    }
    @AuraEnabled
    public static string addportfoliofieldtocontact(list<string> sectorlist,list<string> tickerlist,string conid){
        try{
            contact cont = new contact();
            cont.Id = conid;
            if(sectorlist!=null){
            cont.Sectors__c = string.join(sectorlist,',');
            }
            if(tickerlist!=null){
            cont.Tickers__c = string.join(tickerlist,',');
            }
            update cont;
        }
        catch(DMLException e) {
            throw new DMLException('Unable to Perform the Operation : ' +e.getMessage());
        }    
        return 'success';
    }

   /* @AuraEnabled
    public static string removetickervaluefromcontact(string conid, list<string> tickervalue){
        try{
            contact cont = new contact();
            cont = [select id,Tickers__c from contact where id =:conid];
            cont.Tickers__c = string.join(tickervalue,',');
            update cont;
            return 'success';
        }
        catch(DMLException e) {
            throw new DMLException('Unable to Perform the Operation : ' +e.getMessage());
        }    
    }
    @AuraEnabled
    public static string removesectorvaluefromcontact(string conid, list<string> sectorvalue){
        try{
            contact cont = new contact();
            cont = [select id,Sectors__c from contact where id =:conid];
            cont.Sectors__c = string.join(sectorvalue,',');
            update cont;
            return 'success';
        }
        catch(DMLException e) {
            throw new DMLException('Unable to Perform the Operation : ' +e.getMessage());
        }    
    }*/

    @AuraEnabled(cacheable=true)
    public static list<campaign> getportfoliocampaign(string contactid){
        list<campaign> campaignlist = new list<campaign>();
        try{
            contact cont = new contact();
            cont = [select id,Tickers__c,Sectors__c from contact where id=:contactid];
            system.debug('cont'+cont);
            string tickercont = cont.Tickers__c;
            system.debug('cont'+cont);
            system.debug('cont ticker'+cont.Tickers__c);
            List<string> tickervalue = new List<string>();
                if(tickercont != null){
            tickervalue =  tickercont.split(',');
                    system.debug('tickervalue'+tickervalue);
                }
            List<string> sectorvalue = new List<string>();
                if(cont.Sectors__c != null){
            sectorvalue = cont.Sectors__c.split(',');
                    system.debug('sectorvalue'+sectorvalue);
                }
            campaignlist = [select id,name,StartDate,EndDate,Description,Sector__c,ticker__c from campaign where Sector__c IN: sectorvalue OR ticker__c IN: tickervalue];
            system.debug('campaignlist'+campaignlist);
            return campaignlist;
        }
        catch(DMLException e) {
            throw new DMLException('Unable to Perform the Operation : ' +e.getMessage());
        }    
    }
    @AuraEnabled(cacheable=true)
    public static map<string,list<string>> getportfoliofield(string conttid){
        try{
            contact cont = new contact();
			cont = [select id,tickers__c,Sectors__c from contact where id=:conttid];
            map<string,list<string>> fieldval = new map<string,list<string>>();
            if(cont.tickers__c!=null){
                String tickervalue = cont.tickers__c;
                List<String> tickerlist = tickervalue.split(',');
                fieldval.put('ticker',tickerlist);
                System.debug(fieldval);
            }
            if(cont.Sectors__c!=null){
                String sectorvalue = cont.Sectors__c;
                List<String> sectorlist = sectorvalue.split(',');
                fieldval.put('sector',sectorlist);
            }
            return fieldval;
        }
        catch(DMLException e) {
            throw new DMLException('Unable to Perform the Operation : ' +e.getMessage());
        }    
    }
        @AuraEnabled(cacheable=true)
    public static List<Campaign> getSearchedCampaign(string searchName,string searchSector,string tab,string contactid,string startdatevalue,string enddatevalue){
        string checkForName;
        string checkForSector;
        date fromDate;
        date toDate;
        if(searchName!=null){
        checkForName = '%'+searchName+'%';
        system.debug('checkForName'+checkForName);
        }
        if(searchSector!=null){
        checkForSector = '%'+searchSector+'%';
        }
        
        if(startdatevalue!=null){
        fromDate = Date.valueOf(startdatevalue);
        }
        if(enddatevalue!=null){
        toDate = Date.valueOf(enddatevalue);
        }
            List<campaign> campaignList = new list<campaign>();
        if(tab == 'Schedule'){
           // campaignList = [SELECT Id,name,description,startdate,enddate,sector__c,Ticker__c FROM Campaign WHERE name Like : checkForName OR sector__c like :checkForSector Or (startdate >=:fromDate and enddate <=:toDate) ];
        String query = 'SELECT Id, Name, Description, StartDate, EndDate, Sector__c, Ticker__c FROM Campaign ';

        if (!String.isBlank(checkForName)) 
        {
             query += 'WHERE Name LIKE :checkForName ';
            }
                
        if(String.isBlank(checkForName) && !String.isBlank(checkForSector)){
        query += 'WHERE Sector__c LIKE :checkForSector ';
        }
        else if(!String.isBlank(checkForSector)){
        query += 'AND Sector__c LIKE :checkForSector ';
        }

        if(!String.isBlank(checkForName) || !String.isBlank(checkForSector) && (fromDate != null && toDate != null)) {

        query += 'AND (StartDate >= :fromDate AND EndDate <= :toDate)';
            }
        else if(fromDate != null && toDate != null){
            query += 'WHERE (StartDate >= :fromDate AND EndDate <= :toDate)';
        }
        
            system.debug('query'+query);
            campaignList = Database.query(query);
        }
        if(tab == 'Registered'){
            //campaignList = [SELECT Id,name,description,startdate,enddate,sector__c,Ticker__c FROM Campaign WHERE Id IN (SELECT CampaignId FROM CampaignMember WHERE ContactId =:contactId)  AND (Name LIKE :checkForName OR Sector__c LIKE :checkForSector)];
        	String query = 'SELECT Id,name,description,startdate,enddate,sector__c,Ticker__c FROM Campaign WHERE Id IN (SELECT CampaignId FROM CampaignMember WHERE ContactId =:contactId) ';
            if (!String.isBlank(checkForName)) {
                query += 'AND name LIKE :checkForName ';
            }

            if (!String.isBlank(checkForSector)) {
                query += 'AND Sector__c LIKE :checkForSector ';
            }

            if (fromDate != null && toDate != null) {
            query += 'AND (StartDate >= :fromDate AND EndDate <= :toDate)';
        }
            system.debug('query'+query);
            campaignList = Database.query(query);
            
            system.debug('registered list'+campaignList);
        }
        if(tab == 'Portfolio'){
            List<Campaign> CampaignFromContact = new List<Campaign>();
            CampaignFromContact = skitsoHandler.getportfoliocampaign(contactid);
            system.debug('CampaignFromContact'+CampaignFromContact);
            //campaignList = [SELECT Id,name,description,startdate,enddate,sector__c,Ticker__c FROM Campaign WHERE Id IN: CampaignFromContact AND name Like : checkForName];
            String query = 'SELECT Id, name, Description, StartDate, EndDate, sector__c, Ticker__c FROM Campaign WHERE Id IN: CampaignFromContact ';

            if (!String.isBlank(checkForName)) {
                 query += 'AND name LIKE :checkForName ';
                }
    
            if (!String.isBlank(checkForSector)) {
                query += 'AND sector__c LIKE :checkForSector ';
                }
    
            if (fromDate != null && toDate != null) {
            query += 'AND (StartDate >= :fromDate AND EndDate <= :toDate)';
                }
            system.debug('query Portfolio'+query);
            campaignList = Database.query(query);
            system.debug('campaignList'+campaignList);
        }
            return campaignList;
    }
    /*
     @AuraEnabled(cacheable=true)
    public static List<Campaign> searchRegisteredCampaign(string searchName,string searchSector,string contactId){
        string checkForName = '%'+searchName+'%';
        system.debug('checkForName'+checkForName);
        string checkForSector = '%'+searchSector+'%';
            system.debug('get event list');
            List<campaign> campaignList = new list<campaign>();
        	system.debug('campaignList'+campaignList.size());
            return campaignList;
    }*/
    @AuraEnabled(cacheable=true)
    public static List<Insight_Report__c> getInsightReportList() {
        try{
            List<Insight_Report__c> insightReportList = new List<Insight_Report__c>();
            insightReportList = [select id,Name,Publish_Date__c,Ticker__c from Insight_Report__c LIMIT 20];
            return insightReportList;
        }
        catch(DMLException e) {
            throw new DMLException('Unable to Perform the Operation : ' +e.getMessage());
        }    
    }
    // @AuraEnabled(cacheable=true)
    // public static ContentDocumentLink getRelatedFilesByRecordId(String recordId) {
    //     try{    
    //     ContentDocumentLink contDocLink = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :recordId AND ContentDocument.Title like '%_master'];
    //     system.debug('contDocLink'+contDocLink);
    //     return contDocLink;
    //     }
    //     catch(DMLException e) {
    //         throw new DMLException('Unable to Perform the Operation : ' +e.getMessage());
    //     }   
    // }
    @AuraEnabled(cacheable=true)
    public static Map<String,String> getPreviewDownloadUrl(String recordId) {
        try{    
    ContentDocumentLink contDocLink = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :recordId AND ContentDocument.Title like '%_master'];      
    ContentDistribution conDistribute = [SELECT DistributionPublicUrl, ContentDocumentId, Id, ContentDownloadUrl FROM ContentDistribution where ContentDocumentId =:contDocLink.ContentDocumentId LIMIt 1];
    system.debug('conDistribute'+conDistribute);
    Map<String,String> FileUrl = new Map<String,String>();
    FileUrl.put('viewurl',conDistribute.DistributionPublicUrl);
    FileUrl.put('downloadurl',conDistribute.ContentDownloadUrl);
    return FileUrl;
    }
    catch(DMLException e) {
    throw new DMLException('Unable to Perform the Operation : ' +e.getMessage());
    }   
}
   /*  @AuraEnabled
    public static String getReport() {
        try{ 
            Report rep = [select ID,developername from report where developername = 'New_Accounts_Report_GAq' LIMIT 1];
            return JSON.serialize(Reports.ReportManager.runReport(rep.id,true));
}
        catch(DMLException e) {
    throw new DMLException('Unable to Perform the Operation : ' +e.getMessage());
    }   
    }*/
    @AuraEnabled(cacheable=true)
    public static map<string,date> getSubscriptionDetails(String contactforsubscription) {
        try{   
            List<Contact> cont = [select id,account.Insight_Start_Date__c, account.Insight_End_Date__c from contact where id=: contactforsubscription LIMIT 1];
            map<string,date> datemap = new map<string,date>();
            if(cont.size() > 0){
            datemap.put('startdate',cont[0].account.Insight_Start_Date__c);
            datemap.put('enddate',cont[0].account.Insight_End_Date__c);
            }
            return datemap;
        }
        catch(DMLException e) {
            throw new DMLException('Unable to Perform the Operation : ' +e.getMessage());
            }   
        }
        @AuraEnabled(cacheable=true)
        public static string getSubscription() {
            try{   
                List<Insight_Report__c> cont = new List<Insight_Report__c>();
			    cont = [select id,Reports__c,name from Insight_Report__c where name='Parvez' LIMIT 1];
                string reports = cont[0].Reports__c;
                return reports;
            }
                catch(DMLException e) {
                    throw new DMLException('Unable to Perform the Operation : ' +e.getMessage());
                    }   
                }
            }