import { LightningElement, api, wire } from 'lwc';
import getInsightReportList from '@salesforce/apex/skitsoHandler.getInsightReportList';
import getPreviewDownloadUrl from '@salesforce/apex/skitsoHandler.getPreviewDownloadUrl';
import getSubscriptionDetails from '@salesforce/apex/skitsoHandler.getSubscriptionDetails';
var disableButton = false;
const columnHeaders = [
    { label: 'Report Name', fieldName: 'Name', type: 'text' },
    { label: 'Publish Date', fieldName: 'Publish_Date__c', type: 'text' },
    { label: 'Ticker', fieldName: 'Ticker__c', type: 'text' },
    {
        type: "button", label: 'View', initialWidth: 100, typeAttributes: {
            name: 'View',
            title: 'View',
            disabled: { fieldName: 'disbaleaction'},
            value: 'view',
            iconPosition: 'left',
            iconName: 'utility:preview',
            variant: 'Brand'
        }
    },
    {
        type: "button", label: 'Download', initialWidth: 100, typeAttributes: {
            name: 'Download',
            title: 'Download',
            disabled: { fieldName: 'disbaleaction'},
            value: 'download',
            iconPosition: 'left',
            iconName: 'utility:download',
            variant: 'Brand'
        }
    }
];

export default class InsightReportTable extends LightningElement {
    @api showinsighttable;
    @api contactid;
    insightTable = [];
    insightTableData = [];
    error;
    columns = columnHeaders;
    rowData;
    selectedRecord;
    fileRecord;
    filesList;
    actionName;
    showframe;
    subscriptionDates;
    copyOfInisghtTable = [];
    subscriptionStartDate;
    subscriptionEndDate;
    @wire(getInsightReportList)
    wiredInsightReport(result) {
        this.insightTable = result;
        console.log('this.subscriptionStartDate'+this.subscriptionStartDate);
        console.log('this.subscriptionEndDate'+this.subscriptionEndDate);
        // this.insightTable = result.data.map(item => {
        //     if (
        //         item.Publish_Date__c !== null &&
        //         item.Publish_Date__c >= this.subscriptionStartDate &&
        //         item.Publish_Date__c <= this.subscriptionEndDate
        //     ) {
        //         return { ...item, disableaction: true };
        //     } else {
        //         return item;
        //     }
        // });
        this.copyOfInisghtTable = result;
        if (result.data) {
            this.insightTableData = result.data;
            //console.log('this.insightTableData' + JSON.stringify(this.insightTableData));
        }
        if (result.error) {
            this.error = result.error;
            console.log('Error message:- ' + this.error.body.message);
        }
    }

    getRecordId(event) {
        this.actionName = event.detail.action.name;
        this.rowData = event.detail.row;
        this.selectedRecord = this.rowData.Id;
        // console.log('this.selectedRecord++' + JSON.stringify(this.selectedRecord));
        this.getRelatedFile();
    }
    fullurl;
    getRelatedFile() {
        this.disableButton = true;
        getPreviewDownloadUrl({ recordId: this.selectedRecord })
            .then(result => {
                this.fileRecord = result;
                // console.log('result of file URL='+JSON.stringify(result));
                const view = this.fileRecord.viewurl;
                const download = this.fileRecord.downloadurl;
                if (this.actionName == 'View') {
                    this.showframe = true;
                    this.fullurl = view;
                    this.showinsighttable = false;
                    // console.log('frame loaded@'+this.fullurl);
                    this.template.querySelector('c-common-toast').showToast('success', 'Loading File', 'utility:spinner', 5000);
                    // window.open(view, "_blank");
                }
                if (this.actionName == 'Download') {
                    window.open(download, "_self");
                }

            })
            .catch(error => {
                console.log('error' + JSON.stringify(error));
                this.error = error;
                this.template.querySelector('c-common-toast').showToast('error', this.error.body.message, 'utility:warning', 3000);
            });

    }
    @wire(getSubscriptionDetails,{ contactforsubscription : '$contactid'})
    wiredsubscriptionDates(data,error){
        if(data){
            console.log('contactid'+this.contactid);    
            this.subscriptionDates = data;
            // this.subscriptionStartDate = data.startdate;
            // this.subscriptionEndDate = data.enddate;
            // console.log('dates====='+this.subscriptionStartDate+'='+this.subscriptionEndDate);
            console.log('dates'+JSON.stringify(data));
        }
        if(error){
            console.log('error'+JSON.stringify(error));
        }
    }

    hideFrame() {
        this.showframe = false;
        this.showinsighttable = true;
    }
}