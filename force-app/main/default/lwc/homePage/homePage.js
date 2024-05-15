import { LightningElement, api } from 'lwc';
import download from '@salesforce/resourceUrl/skitsologo';
import artimage from '@salesforce/resourceUrl/skitsoart';
import verifyUser from '@salesforce/apex/skitsoHandler.verifyUser';
export default class HomePage extends LightningElement {
  Imageurl = download;
  brushes = artimage + '/skitsotool/images/art.jpg';
  showRegister;
  showparent = true;
  username;
  password;
  @api eventbool;
  contid;
  uid;
  error;
  panelvar;
  tablevar;
  showlogin = true;
  headerBool;
  handleUsernameChange(event) {
    this.username = event.target.value;
  }
  handlePasswordChange(event) {
    this.password = event.target.value;
  }
  signup() {
    this.showRegister = true;
    this.showlogin = false;
  }
  login() {
      verifyUser({ cal_username: this.username, cal_password: this.password })
        .then(result => {
            if(result){
            this.contid = result.Id;
            this.uid = result.UID__c;
            this.template.querySelector('c-common-toast').showToast('success', 'Logged In successfully', 'utility:check', 3000);
            this.eventbool = true;
            this.panelvar = true;
            this.tablevar = true;
            this.headerBool = true;
            this.showlogin = false;
            this.showparent = false;
            this.headervalue = true;
           }
             else{
            this.template.querySelector('c-common-toast').showToast('error', 'Check your Credentials', 'utility:warning', 10000);
             }
        })
        .catch(error => {
          console.log('Error :- ' + JSON.stringify(error));
          this.error = error;
          this.template.querySelector('c-common-toast').showToast('error',this.error.body.message, 'utility:warning', 10000);
        });
  }
  backtologin(event){
    this.showlogin = event.detail.value;
    console.log('back to login clicked+'+this.showlogin);
  }
}