import { LightningElement,api } from 'lwc';
import download from '@salesforce/resourceUrl/comingsoon';
export default class Requestevent extends LightningElement {
    @api showrequestevent;
    Imageurl = download;
}