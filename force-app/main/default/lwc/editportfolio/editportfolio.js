import { LightningElement, api, wire, track } from 'lwc';
import getCampaignTicker from '@salesforce/apex/skitsoHandler.getCampaignTicker';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import SECTOR_FIELD from '@salesforce/schema/Campaign.Sector__c';
import addportfoliofieldtocontact from '@salesforce/apex/skitsoHandler.addportfoliofieldtocontact';
import getportfoliofield from '@salesforce/apex/skitsoHandler.getportfoliofield';
import { refreshApex } from '@salesforce/apex';
export default class Editportfolio extends LightningElement {
    @api editportfoliomodal;
    @api contactid;
    ticker;
    sector;
    sectors;
    tickerlist = [];
    tickerValues = [];
    sectorValues = [];
    refreshtable = [];
    @track value;
    @track showTickerValues = false;
    tickerSelectedValue;
    campname;
    showedvalueId;
    selectedTickerToRemove;
    selectedSectorToRemove;
    tickersearchvalue;
    tickerValueToSplice = [];
    sectorValueToSplice = [];
    copyOfSectorValue = [];
    copyOfTickerValue = [];
    sectorSelectedValue;
    tickerSelectedValue;
    tickerSearchList = [];
    error;
    wiredListSector = [];
    sectorListToTrim = [];
    sectorTrimmedList = [];
    showSectorValues;
    storeSectorValues;
    tickerSelectedValueFromSearchBox;
    //Getting Sector values in list box
    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: SECTOR_FIELD })
    wiredlist({ error, data }) {
        if (data) {
            this.wiredListSector = data;
            this.storeSectorValues = this.wiredListSector.values;
        }
    }
    if(error) {
        this.error = error;
        console.log('error' + JSON.stringify(this.error));
        console.log('Error message:- ' + this.error.body.message);
    }
    // Getting Ticker values in list box
    @wire(getCampaignTicker)
    wiredCampaign({ error, data }) {
        if (data) {
            this.tickerlist = data;
            this.tickerSearchList = JSON.parse(JSON.stringify(data));
        } if (error) {
            this.error = error;
            console.log('error' + JSON.stringify(this.error));
            console.log('Error message:- ' + this.error.body.message);
        }
    }
    handleTickerSearch(event) {
        this.tickersearchvalue = event.target.value;
        console.log('this.tickersearchvalue' + this.tickersearchvalue);
        this.tickerSelectedValueFromSearchBox = JSON.stringify(this.tickerSearchList);
        console.log('this.tickerSelectedValueFromSearchBox' + this.tickerSelectedValueFromSearchBox);
        this.tickerSearchItem = this.tickerSearchList.filter(record => record.Ticker__c.includes(this.tickersearchvalue));
        console.log('this.tickerSearchItem' + JSON.stringify(this.tickerSearchItem));
        //this.tickerlist = this.tickerSearchItem;
        this.tickerlist = this.tickerSearchItem.filter(record => this.tickerValues.every(value => !record.Ticker__c.includes(value)));
        console.log('this.tickerlist From Search' + JSON.stringify(this.tickerlist));
    }
    @wire(getportfoliofield, { conttid: '$contactid' })
    wiredContact(result) {
        this.refreshtable = result;
        if (result.data) {
            if (typeof result.data.ticker !== 'undefined') {
                this.tickerValues = result.data.ticker;
            }
            if (typeof result.data.sector !== 'undefined') {
                this.sectorValues = result.data.sector;
            }
        } if (result.error) {
            this.error = error;
            console.log('error' + JSON.stringify(this.error));
            console.log('Error message:- ' + this.error.body.message);
        }
    }

    handleSectorBoxClick(event) {
        this.showSectorValues = true;
        this.showTickerValues = false;
        console.log('this.storeSectorValues&&&' + this.storeSectorValues);
        this.storeSectorValues = this.storeSectorValues.filter(record => this.sectorValues.every(value => !record.label.includes(value)));
        console.log('this.this.storeSectorValues' + JSON.stringify(this.storeSectorValues));
        event.stopPropagation();
        return false;
    }
    handleTickerBoxClick(event) {
        this.showTickerValues = true;
        this.showSectorValues = false;
        this.tickerlist = this.tickerlist.filter(record => this.tickerValues.every(value => !record.Ticker__c.includes(value)));
        event.stopPropagation();
        return false;
    }
    saveTickerSectorValues() {
        //Faced issue while clicking Save & Go Back 
        this.showTickerValues = false;
        this.showSectorValues = false;
        addportfoliofieldtocontact({ conid: this.contactid, sectorlist: this.sectorValues, tickerlist: this.tickerValues })
            .then(result => {
                refreshApex(this.refreshtable);
                this.dispatchEvent(new CustomEvent('rendertable', {
                    detail: {
                        value: true
                    }
                }));
            })
            .catch(error => {
                console.log('error' + JSON.stringify(error));
                this.error = error;
                this.template.querySelector('c-common-toast').showToast('error', JSON.stringify(this.error), 'utility:warning', 10000);
            });
        this.dispatchEvent(new CustomEvent('hidemodalbox', {
            detail: {
                value: false
            }
        }));
    }

    handleTickerClick(e) {
        this.selectedTickerToRemove = e.target.name;
        const index = this.tickerValues.indexOf(this.selectedTickerToRemove);
        this.tickerValueToSplice = JSON.parse(JSON.stringify(this.tickerValues));
        if (index > -1) {
            this.tickerValueToSplice.splice(index, 1);
        }
        this.tickerValues = this.tickerValueToSplice;
        this.showTickerValues = false;
        this.showSectorValues = false;
    }
    handleTickerSelection(event) {
        this.tickerSelectedValue = event.target.dataset.label;
        this.showedvalueId = event.target.dataset.value;
        if (typeof this.tickerValues == 'undefined') {
            this.tickerValues = [];
            this.copyOfTickerValue = this.tickerValues;
        }
        else {
            this.copyOfTickerValue = JSON.parse(JSON.stringify(this.tickerValues));
        }
        if (!this.copyOfTickerValue.includes(this.tickerSelectedValue)) {
            this.copyOfTickerValue.push(this.tickerSelectedValue);
            this.tickerValues = this.copyOfTickerValue;
        }
        this.tickerSelectedValue = '';
        this.showTickerValues = false;
    }
    handleSectorClick(e) {
        this.selectedSectorToRemove = e.target.name;
        const index = this.sectorValues.indexOf(this.selectedSectorToRemove);
        this.sectorValueToSplice = JSON.parse(JSON.stringify(this.sectorValues));
        if (index > -1) {
            this.sectorValueToSplice.splice(index, 1);
        }
        this.sectorValues = this.sectorValueToSplice;
        this.tickerSelectedValue = '';
        this.sectorSelectedValue = '';
        this.showTickerValues = false;
        this.showSectorValues = false;
    }
    handleSectorSelection(event) {
        this.sectorSelectedValue = event.target.dataset.label;
        if (typeof this.sectorValues == 'undefined') {
            this.sectorValues = [];
            this.copyOfSectorValue = this.sectorValues;
        }
        else {
            this.copyOfSectorValue = JSON.parse(JSON.stringify(this.sectorValues));
            console.log('this.copyOfSectorValue Step 2' + this.copyOfSectorValue);
        }
        if (!this.copyOfSectorValue.includes(this.sectorSelectedValue)) {
            this.copyOfSectorValue.push(this.sectorSelectedValue);
            this.sectorValues = this.copyOfSectorValue;
        }
        this.sectorSelectedValue = '';
        this.showSectorValues = false;
    }

    connectedCallback() {
        document.addEventListener('click', this._handler = this.close.bind(this));
    }
    disconnectedCallback() {
        document.removeEventListener('click', this._handler);
    }
    close() {
        this.showDeptListVar = false;
        this.showTickerValues = false;
        this.showSectorValues = false;
    }
}