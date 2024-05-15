import { LightningElement, api, track, wire } from 'lwc';
import getRegisteredCampaign from '@salesforce/apex/skitsoHandler.getRegisteredCampaign';
import { refreshApex } from '@salesforce/apex';
const columns = [
    { label: 'Name', fieldName: 'Name', type: 'text'},// sortable: "true", cellAttributes: { class: { fieldName: 'rowColor' } } },
    { label: 'Start Date', fieldName: 'StartDate', type: 'text'},// cellAttributes: { class: { fieldName: 'rowColor' } } },
    { label: 'End Date', fieldName: 'EndDate', type: 'text'},// cellAttributes: { class: { fieldName: 'rowColor' } } },
    { label: 'Description', fieldName: 'Description', type: 'text'},// cellAttributes: { class: { fieldName: 'rowColor' } } },
    { label: 'Sector', fieldName: 'Sector__c', type: 'text'}// cellAttributes: { class: { fieldName: 'rowColor' } } }
];
export default class Registeredevent extends LightningElement {
    @api showregisteredevent;
    @api campaignmemberid;
    @track columns = columns;
    tabIcon = 'utility:multi_select_checkbox';
    registeredcampaign = [];
    showmodal;
    selectedRows;
    @track sortedBy;
    sortDirection = 'asc';
    campname;
    campdesc;
    campmemberid;
    refreshtable;
    tabValue = 'Registered';
    searchedTable = [];
    copyofRegisteredCampaign = [];


    pageSizeOptions = [5, 10, 25, 50, 75, 100]; //Page size options
    records = []; //All records available in the data table
    // columns = []; //columns information available in the data table
    totalRecords = 0; //Total no.of records
    pageSize; //No.of records to be displayed per page
    totalPages; //Total no.of pages
    pageNumber = 1; //Page number    
    recordsToDisplay = []; //Records to be displayed on the page

    

    // renderedCallback() {
    //     refreshApex(this.refreshtable);
    // }
    /*
    @wire(getRegisteredCampaign, { contactid: '$campaignmemberid' })
    wiredEvents(result) {
        this.refreshtable = result;
        
        if (result.data) {
            // this.registeredcampaign = result.data
            //     .map(item => {
            //         if (item.name !== null) {
            //             return { ...item, "rowColor": "slds-icon-custom-custom95 slds-text-color_default" }
            //         }
            //     })
            this.records = result.data;
        this.totalRecords = result.data.length; // update total records count                 
        this.pageSize = this.pageSizeOptions[0]; //set pageSize with default value as first option
        this.paginationHelper(); // call helper menthod to update pagination logic 
            this.copyofRegisteredCampaign = this.registeredcampaign;
        } else if (result.error) {
            this.error = result.error;
            console.log('error' + JSON.stringify(this.error));
            console.log('Error message:- ' + this.error.body.message);
        }
    }
    */
   
   connectedcallback(){
    this.getInitialRecords();
    console.log('connected callback+1');
   }
    getInitialRecords(){
        console.log('inside method');
        getRegisteredCampaign({ contactid: this.campaignmemberid})
            .then((result) => {
                    console.log('RESULT--> ' + JSON.stringify(result.length));
                    this.records = result;
                    this.totalRecords = result.length; // update total records count                 
                    this.pageSize = this.pageSizeOptions[0]; //set pageSize with default value as first option
                    this.paginationHelper(); // call helper menthod to update pagination logic 
            })
            .catch((error) => {
                console.log('error while fetch contacts--> '+JSON.stringify(error));
            });
    }
    //Pagianation
    get bDisableFirst() {
        return this.pageNumber == 1;
    }
    get bDisableLast() {
        return this.pageNumber == this.totalPages;
    }
    handleRecordsPerPage(event) {
        this.pageSize = event.target.value;
        this.paginationHelper();
    }
    previousPage() {
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }
    nextPage() {
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }
    firstPage() {
        this.pageNumber = 1;
        this.paginationHelper();
    }
    lastPage() {
        this.pageNumber = this.totalPages;
        this.paginationHelper();
    }
    // JS function to handel pagination logic 
    paginationHelper() {
        this.recordsToDisplay = [];
        // calculate total pages
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        // set page number 
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }
        // set records to display on current page 
        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecords) {
                break;
            }
            this.recordsToDisplay.push(this.records[i]);
        }
    }


    //Pagianation
    handleSelectedRow(event) {
        this.selectedRows = event.detail.selectedRows;
        if (event.detail.config.action == 'rowSelect') {
            this.campmemberid = this.selectedRows[0].Id;
            this.campname = this.selectedRows[0].Name;
            this.campdesc = this.selectedRows[0].Description;
            this.showmodal = true;
        }
    }
    handleSort(event) {
        this.sortedBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortedBy, this.sortDirection);
    }
    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.registeredcampaign));
        let keyValue = (a) => {
            return a[fieldname];
        };
        let isReverse = direction === 'asc' ? 1 : -1;
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : '';
            y = keyValue(y) ? keyValue(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        this.registeredcampaign = parseData;
    }
    hidemodalbox(event) {
        this.showmodal = event.detail.value;
    }
    searchitemintable(event) {
        this.searchedTable = event.detail.value;
        this.registeredcampaign = this.searchedTable;
        this.registeredcampaign = this.registeredcampaign.map(item => {
            if (item.name !== null) {
                return { ...item, "rowColor": "slds-icon-custom-custom95 slds-text-color_default" }
            }
        })
    }
    clearitemtable(event) {
        this.registeredcampaign = this.copyofRegisteredCampaign;
    }
}