import { LightningElement, api, wire, track } from 'lwc';
import getCampaignList from '@salesforce/apex/skitsoHandler.getCampaignList';
const columns = [
    { label: 'Name', fieldName: 'Name', type: 'text', sortable: "true" },
    { label: 'Start Date', fieldName: 'StartDate', type: 'text' },
    { label: 'End Date', fieldName: 'EndDate', type: 'text' },
    { label: 'Description', fieldName: 'Description', type: 'text' },
    { label: 'Sector', fieldName: 'Sector__c', type: 'text' }
];
export default class Sitehomepage extends LightningElement {
    @api showevent;
    @api pinvalue;
    @api contactids;
    @api registerremoved;
    @track showModal;
    openModal = false;
    @track eventList = [];
    registerdisabled = true;
    @track columns = columns;
    @track filteredData = [];
    @track sortedBy;
    sortDirection = 'asc';
    modalvar;
    selectedIds = [];
    @track selectedRows;
    removecampaignID;
    recordInTable = 15;
    rowOffSet = 0;
    lengthoftableitems;
    lengthofsearcheditems;
    tableToRefresh = [];
    isLoading = true;
    tabValue = 'Schedule';
    stopLoading;
    copyofEvents = [];
    tabIcon = 'utility:event';
    connectedCallback() {
        this.loadData();
    }
    loadData() {
        return getCampaignList({offset: this.rowOffSet})
            .then(result => {
                this.tableToRefresh = result;
                this.isLoading = false;
                let updatedRecords = [...this.filteredData, ...result];
                this.filteredData = updatedRecords;
                this.copyofEvents = this.filteredData;
                this.lengthoftableitems = this.filteredData.length;
            })
            .catch(error => {
                this.error = error;
                console.log('this.error' + this.error);
            });
    }
    loadMoreEvents(event) {
        const { target } = event;
        target.isLoading = false;
        this.rowOffSet = this.rowOffSet + this.recordInTable;
        if (!this.stopLoading) {
            this.loadData()
                .then(() => {
                    target.isLoading = false;
                });
        }
    }
    handleSelectedRow(event) {
        this.selectedRows = event.detail.selectedRows;
        if (event.detail.config.action == 'rowSelect') {
            this.selectedIds = [];
            for (let i = 0; i < this.selectedRows.length; i++) {
                this.selectedIds.push(this.selectedRows[i].Id);
            }
        }
        if (event.detail.config.action == 'rowDeselect') {
            console.log('length' + this.selectedRows.length);
            this.selectedIds = [];
            for (let i = 0; i < this.selectedRows.length; i++) {
                this.selectedIds.push(this.selectedRows[i].Id);
            }
        }
        if (this.selectedRows.length > 0) {
            this.registerdisabled = false;
        }
        else {
            this.registerdisabled = true;
        }
    }
    searchitemintable(event) {
        this.stopLoading = true;
        this.filteredData = event.detail.value;
        this.lengthofsearcheditems = this.filteredData.length;
        if (this.lengthofsearcheditems < this.recordInTable) {
            const baseTableEle = this.template.querySelector('lightning-datatable');
            if (baseTableEle) {
                baseTableEle.enableInfiniteLoading = false;
            }
        }
    }
    clearitemtable(event) {
        this.filteredData = this.copyofEvents;
        this.stopLoading = false;
    }
    handleSort(event) {
        this.sortedBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortedBy, this.sortDirection);
    }
    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.filteredData));
        let keyValue = (a) => {
            return a[fieldname];
        };
        let isReverse = direction === 'asc' ? 1 : -1;
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : '';
            y = keyValue(y) ? keyValue(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        this.filteredData = parseData;
    }
}