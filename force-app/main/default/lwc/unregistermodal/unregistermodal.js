import { LightningElement,api } from 'lwc';
import removeRegisteredCampaign from '@salesforce/apex/skitsoHandler.removeRegisteredCampaign';

export default class Unregistermodal extends LightningElement {
    @api showunregistermodal;
    @api sendcampaign;
    @api sendcampaigndesc;
    @api campaignmembertoremove;
    @api contactid;

    remove(){
        removeRegisteredCampaign({campid : this.campaignmembertoremove,contactidtoremove : this.contactid})
        .then(result => {
                console.log('campaign removed'+JSON.stringify(result));
                this.template.querySelector('c-common-toast').showToast('success', 'Registration Cancelled successfully', 'utility:check', 3000);
                this.dispatchEvent(new CustomEvent('closemodal', {
                    detail: {
                        value: false
                    }
                }));

    })
        .catch(error => {
            console.log('error'+JSON.stringify(error));
            this.template.querySelector('c-common-toast').showToast('error',JSON.stringify(error.body.message), 'utility:warning', 10000);
        })
    }

    hideModalBox(){
        this.dispatchEvent(new CustomEvent('closemodal', {
            detail: {
                value: false
            }
        }));
    }
}