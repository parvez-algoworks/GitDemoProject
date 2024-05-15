import { LightningElement, api } from 'lwc';
import getEmailforRegistration from '@salesforce/apex/skitsoHandler.getEmailforRegistration';
export default class RegisterUSer extends LightningElement {
  username;
  password;
  repassword;
  @api signupBoolean;
  error;
  handleUsernameChange(event) {
    this.username = event.target.value;
  }
  handlePasswordChange(event) {
    this.password = event.target.value;
  }
  handleRePasswordChange(event) {
    this.repassword = event.target.value;
  }
  register() {
    if (this.password == this.repassword) {
      getEmailforRegistration({ cal_username: this.username, cal_password: this.password })
        .then(result => {
          if (result) {
            this.template.querySelector('c-common-toast').showToast('success', 'Signed Up successfully', 'utility:check', 10000);
          }
        })
        .catch(error => {
          this.error = error;
          console.log('Error :- ' + error.body.message);
          this.template.querySelector('c-common-toast').showToast('error', JSON.stringify(this.error), 'utility:warning', 10000);
          this.template.querySelectorAll('lightning-input').forEach(element => {
            element.value = null;
          });
        });
    }
  }
  login() {
    this.signupBoolean = false;
    this.dispatchEvent(new CustomEvent('calllogin', {
      detail: {
        value: true
      }
    }));
  }
}