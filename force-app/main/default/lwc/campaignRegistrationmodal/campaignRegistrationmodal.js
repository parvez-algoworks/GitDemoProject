import { LightningElement, api, track, wire } from 'lwc';
import getCampaigntoregister from '@salesforce/apex/skitsoHandler.getCampaigntoregister';
import addmembertocampaign from '@salesforce/apex/skitsoHandler.addmembertocampaign';
const actions = [
    { label: 'remove', name: 'remove' }
];
const columns = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Start Date', fieldName: 'StartDate', type: 'text' },
    { label: 'End Date', fieldName: 'EndDate', type: 'text' },
    { label: 'Sector', fieldName: 'Sector__c', type: 'text' },
    {type: 'action', typeAttributes: {rowActions: actions,menuAlignment: 'right' }}];
    
export default class CampaignRegistrationmodal extends LightningElement {
    @api openmodal;
    @api campaignlistfromheader;
    @api contactidsfromheader;
    @track columns = columns;
    error;
    @track listdata = [];
    removecampaignID;
    tabledata = [];
    listofcampaign = [];
    errormsg;
    isLoading = true;

    @wire(getCampaigntoregister, { campids: '$campaignlistfromheader' })
    wiredEvents({ error, data }) {
        if (data) {
            this.listdata = data;
            this.tabledata = data;
            this.isLoading = false;
        } else if (error) {
            this.error = error;
            console.log('error' + JSON.stringify(this.error));
            console.log('Error message:- ' + this.error.body.message);
        }
    }
    handleRowLevelAct(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        if (actionName === 'remove') {
            this.removeCampaign(row.Id);
        }
    }
    removeCampaign(campaignId) {
        const index = this.tabledata.findIndex(campaign => campaign.Id === campaignId);
        if (index !== -1) {
            this.tabledata = JSON.parse(JSON.stringify(this.tabledata));
            this.tabledata.splice(index, 1);
            this.errormsg = false;
        }
    }
    hideModalBox() {
        console.log('modal'+this.campaignlistfromheader);
        console.log('modal'+this.contactidsfromheader);
        this.dispatchEvent(new CustomEvent('changemodal', {
            detail: {
                value: false
            }
        }));
    }

    confirmregistration() {
        console.log('this.tabledata'+this.tabledata);
        for (let i = 0; i < this.tabledata.length; i++) {

            this.listofcampaign.push(this.tabledata[i].Id);
        }
        
        addmembertocampaign({ conid: this.contactidsfromheader, campid: this.listofcampaign })
            .then((result) => {
                console.log('inside result to add');
                console.log('this.contactidsfromheader'+this.contactidsfromheader);
                console.log('this.listofcampaign'+this.listofcampaign);
                this.template.querySelector('c-common-toast').showToast('success', 'Campaign member added successfully', 'utility:check', 3000);
                // this.hideModalBox();
            })
            .catch((error) => {
                this.errormsg = JSON.stringify(error.body.pageErrors[0].message);
            });
            this.dispatchEvent(new CustomEvent('closemodal', {
                detail: {
                    value: false
                }
            }));
    }
}