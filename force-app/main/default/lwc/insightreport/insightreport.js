import { LightningElement,api,wire } from 'lwc';
import download from '@salesforce/resourceUrl/comingsoon';
import getSubscription from '@salesforce/apex/skitsoHandler.getSubscription';
export default class Insightreport extends LightningElement {
    @api showinsightreport;
    @api loggedincontact;
    showinsightreportdata = true;
    Imageurl = download;
    hideDateFilter = true;
    hideSector = true;
    showPublishDateField = true;
    activeTab = 'Insight Report';
    tabIcon = 'utility:page';
    showlookup;
    showtimetracking;
    showforecasting;


    @wire(getSubscription,{ contactforsubscription : '$loggedincontact'})
    wiredsubscriptionDates(data,error){
        if(data){
            console.log('contactid'+JSON.stringify(data));    
            
        }
        if(error){
            console.log('error'+JSON.stringify(error));
        }
    }
}   