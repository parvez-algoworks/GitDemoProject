import { LightningElement } from 'lwc';
import FullCalendarJS from '@salesforce/resourceUrl/Fullcalendar';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
export default class CustomCalendar extends LightningElement {

    connectedCallback() {
        Promise.all([
            loadStyle(this, FullCalendarJS + '/lib/main.css'),
            loadScript(this, FullCalendarJS + '/lib/main.js')
        ])
        .then(() => {
            this.initializeCalendar();
        })
        .catch(error => console.log(error))
    }
    initializeCalendar() { 
        const calendarEl = this.template.querySelector('div.fullcalendar');
        const calendar = new FullCalendar.Calendar(calendarEl, {});
        calendar.render();
    }
}