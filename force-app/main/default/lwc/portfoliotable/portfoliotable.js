import { LightningElement, wire, api, track } from 'lwc';
import getportfoliocampaign from '@salesforce/apex/skitsoHandler.getportfoliocampaign';
import { refreshApex } from '@salesforce/apex';
const columnHeaders = [
    { label: 'Name', fieldName: 'Name', type: 'text', sortable: "true" },
    { label: 'Start Date', fieldName: 'StartDate', type: 'text' },
    { label: 'End Date', fieldName: 'EndDate', type: 'text' },
    { label: 'Description', fieldName: 'Description', type: 'text' },
    { label: 'Sector', fieldName: 'Sector__c', type: 'text' }
];
export default class Portfoliotable extends LightningElement {
    tabledata = [];
    columns = columnHeaders;
    @api contid;
    @api tablefromheader;
    @api searchedportfoliocampaign;
    @api portfoliocampaign;
    @api loadtable;
    isLoading = true;
    errormessage;
    portfolioTableToRefresh = [];
    testTable = [];
    searchedTable = [];
    clearTable = [];
    portfolioTable = [];
    @api originaltable;
    columnValues = ['Name', 'Start Date', 'End Date', 'Description', 'Sector'];
    @wire(getportfoliocampaign, { contactid: '$contid'})
    wiredCampaign(result) {
        this.portfolioTableToRefresh = result;
        this.portfolioTable = this.portfolioTableToRefresh.data;
        if (result.data) {
            if(!this.loadtable){
            console.log('table loading');
            this.tabledata = result.data;
            this.isLoading = false;
            }
        }
        if (result.error) {
            this.error = result.error;
            this.isLoading = true;
            this.errormessage = true;
            console.log('error' + JSON.stringify(this.error));
            console.log('Error message:- ' + this.error.body.message);
        }
        this.dispatchEvent(new CustomEvent('tabletoportfolio', {
            detail: {
                value: this.portfolioTable
            }
        }));
    }
    @api refreshTable(){
        console.log('inside refresh table');
        this.loadtable = false;
        refreshApex(this.portfolioTableToRefresh);
        this.tabledata = this.portfolioTableToRefresh.data;
    }
    get tablefromheader(){
        console.log('inside get');
        return this.testTable;
    }
    set tablefromheader(value){
        console.log('inside set');
        this.tabledata = value;
    }
    downloadFile(){
            // Prepare a html table
            let doc = '<table>';
            // Add styles for the table
            doc += '<style>';
            doc += 'table, th, td {';
            doc += '    border: 1px solid black;';
            doc += '    border-collapse: collapse;';
            doc += '}';          
            doc += '</style>';
            // Add all the Table Headers
            doc += '<tr>';
            this.columnValues.forEach(element => {            
                doc += '<th>'+ element +'</th>'           
            });
            doc += '</tr>';
            // Add the data rows
            this.tabledata.forEach(record => {
                doc += '<tr>';
                doc += '<th>'+record.Name+'</th>'; 
                doc += '<th>'+record.StartDate+'</th>'; 
                doc += '<th>'+record.EndDate+'</th>';
                doc += '<th>'+record.Description+'</th>'; 
                doc += '<th>'+record.Sector__c+'</th>'; 
                doc += '</tr>';
            });
            doc += '</table>';
            var element = 'data:application/vnd.ms-excel,' + encodeURIComponent(doc);
            let downloadElement = document.createElement('a');
            downloadElement.href = element;
            downloadElement.target = '_self';
            // use .csv as extension on below line if you want to export data as csv
            downloadElement.download = 'Contact Data.xls';
            document.body.appendChild(downloadElement);
            downloadElement.click();
    }
}