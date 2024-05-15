import { LightningElement, api } from 'lwc';
import getSearchedCampaign from '@salesforce/apex/skitsoHandler.getSearchedCampaign';
import { refreshApex } from '@salesforce/apex';
export default class Header extends LightningElement {
    @api showheader;
    @api registeredeventtable;
    @api tablelist;
    @api registerbutton;
    @api campaignlist;
    @api contactidstomodal;
    @api selectedtab;
    @api contactid;
    @api icon;
    showModal;
    openModal;
    sendbacktable = [];
    name;
    sector;
    startdatechange;
    enddatechange;
    filteredData = [];
    registerbutton = true;
    error;
    stopLoading;
    @api hideDateRange;
    @api hideSectorField;
    @api showPublishDate;
    handlenamechange(event) {
        this.name = event.target.value;
    }
    handlesectorchange(event) {
        this.sector = event.target.value;
    }
    handlestartdatechange(event) {
        this.startdatechange = event.target.value;
    }
    handleenddatechange(event) {
        this.enddatechange = event.target.value;
    }
    search() {
        let fromdateValue = this.template.querySelector(".todate");
        if (this.startdatechange && !this.enddatechange) {
            fromdateValue.setCustomValidity("To Date is required");
        } else {
            fromdateValue.setCustomValidity("");
        }
        fromdateValue.reportValidity();

        let todateValue = this.template.querySelector(".fromdate");
        if (!this.startdatechange && this.enddatechange) {
            todateValue.setCustomValidity("From Date is required");
        } else {
            todateValue.setCustomValidity("");
        }
        todateValue.reportValidity();

        this.stopLoading = true;
        // this.dispatchEvent(new CustomEvent('stoploadtable', {
        //     detail: {
        //         value: this.stopLoading
        //     }
        // }));
        // this.filteredData = this.registeredeventtable.filter(record =>
        //     (!this.name || record.Name?.includes(this.name)) &&
        //     (!this.sector || record.Sector__c?.includes(this.sector)) &&
        //     (!this.startdatechange || record?.StartDate >= this.startdatechange) &&
        //     (!this.enddatechange || record?.EndDate <= this.enddatechange) &&
        //     (!this.startdatechange || !this.enddatechange || this.startdatechange && this.enddatechange));
        // console.log('this.name'+this.name);
        // console.log('this.sector'+this.sector);
        // console.log('this.contactid'+this.contactid);
        // console.log('this.selectedtab'+this.selectedtab);
        // console.log('this.startdatechange'+this.startdatechange);
        // console.log('this.enddatechange ---'+this.enddatechange);
        // if(typeof this.sector == 'undefined') {
        //     this.sector = null;
        // }
        // if(typeof this.name == 'undefined') {
        //     this.name = null;
        // }
        // if(typeof this.sector == 'undefined') {
        //     this.sector = null;
        // }
        // if(typeof this.startdatechange == 'undefined') {
        //     this.startdatechange = null;
        // }
        // if(typeof this.enddatechange == 'undefined') {
        //     this.enddatechange = null;
        // }
       if(this.name || this.sector || this.startdatechange || this.enddatechange){
        getSearchedCampaign({searchName : this.name, searchSector : this.sector,contactid : this.contactid,tab : this.selectedtab,startdatevalue : this.startdatechange ,enddatevalue : this.enddatechange})
        .then(result => {
            this.filteredData = result;
            // console.log('Searched fired inside header'+JSON.stringify(this.filteredData.length));
            this.dispatchEvent(new CustomEvent('searchedtable', {
                detail: {
                    value: this.filteredData
                }
            }));
        })
        .catch(error => {
            console.log('error'+JSON.stringify(error));
            this.error = error;
            this.template.querySelector('c-common-toast').showToast('error', this.error, 'utility:warning', 10000);
        });
    }
    this.sendbacktable = this.registeredeventtable;
    

        // console.log('this.name'+this.registeredeventtable);
        //  console.log('filteredData from header length == '+this.filteredData);
    }
    registerCampaign() {
        this.showModal = true;
        this.openModal = true;
    }
    closemodal(event){
        this.showModal = event.detail.value;
    }
    hideModalBox(event){
        this.showModal = event.detail.value;
    }

    clearsearchvalue() {
        // console.log('this.name in search method'+this.name);
        // console.log('this.sector in search method'+this.sector);
        // this.sendbacktable = this.registeredeventtable;

        this.stopLoading = false;
        // console.log('this.registeredeventtable trial'+this.registeredeventtable);
        this.name = null;
        this.sector = null;
        this.startdatechange = null;
        this.enddatechange = null;
        // this.filteredData = [];
        // console.log('emptying');
        this.dispatchEvent(new CustomEvent('cleartable', {
            detail: {
                value: this.registeredeventtable
            }
        }));
       // console.log('this.sendbacktable'+this.sendbacktable);
    }
}