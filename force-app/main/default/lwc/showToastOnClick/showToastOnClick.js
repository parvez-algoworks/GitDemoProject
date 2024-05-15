import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class ShowToastOnClick extends LightningElement {


    showToast1() {
        const event = new ShowToastEvent({
            title: 'Tool Test 1',
            variant: 'success',
            message:
                'Tool 1 Clicked.',
        });
        this.dispatchEvent(event);
    }
    showToast2() {
        const event = new ShowToastEvent({
            title: 'Tool Test 2',
            variant: 'success',
            message:
                'Tool 2 Clicked.',
        });
        this.dispatchEvent(event);
    }
    showToast3() {
        const event = new ShowToastEvent({
            title: 'Tool Test 3',
            variant: 'success',
            message:
                'Tool 3 Clicked.',
        });
        this.dispatchEvent(event);
    }
    showToast4() {
        const event = new ShowToastEvent({
            title: 'Tool Test 4',
            variant: 'success',
            message:
                'Tool 4 Clicked.',
        });
        this.dispatchEvent(event);
    }
    showToast5() {
        const event = new ShowToastEvent({
            title: 'Tool Test 5',
            variant: 'success',
            message:
                'Tool 5 Clicked.',
        });
        this.dispatchEvent(event);
    }
}