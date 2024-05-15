import { LightningElement,api } from 'lwc';
import download from '@salesforce/resourceUrl/comingsoon';
export default class Requestinsightreport extends LightningElement {
    @api showrequestinsightreport;
    Imageurl = download;
}