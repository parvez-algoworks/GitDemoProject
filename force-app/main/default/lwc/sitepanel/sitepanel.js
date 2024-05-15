import { LightningElement, api } from 'lwc';
export default class Sitepanel extends LightningElement {
        @api showpanel;
        @api showtable;
        @api contactid;
        @api headervar;
        @api pinvalue;
        schedulevar;
        portfoliovar;
        hidehome;
        registeredeventvar;
        insightreporttvar;
        requesteventvar;
        requestinsightreportvar;
        activeClassschedule = 'slds-nav-vertical__item slds-is-active';
        registeredDisconnectVar;


        callschedule() {
                this.eventbool = true;
                this.showtable = true;
                this.portfoliovar = false;
                this.hidehome = false;
                this.insightreporttvar = false;
                this.requesteventvar = false;
                this.registeredeventvar = false;
                this.requestinsightreportvar = false;
                this.headervar = true;
                this.activeClassschedule = 'slds-nav-vertical__item slds-is-active';
                this.activeClassportfolio = 'slds-nav-vertical__item';
                this.activeClassregisteredevent = 'slds-nav-vertical__item';
                this.activeClassinsightreportt = 'slds-nav-vertical__item';
                this.activeClassrequestevent = 'slds-nav-vertical__item';
                this.activeClassrequestinsightreport = 'slds-nav-vertical__item';

        }
        callportfolio() {
                this.portfoliovar = true;
                this.showtable = false;
                this.insightreporttvar = false;
                this.requesteventvar = false;
                this.registeredeventvar = false;
                this.requestinsightreportvar = false;
                this.eventbool = false;
                this.activeClassportfolio = 'slds-nav-vertical__item slds-is-active';
                this.activeClassschedule = 'slds-nav-vertical__item';
                this.activeClassregisteredevent = 'slds-nav-vertical__item';
                this.activeClassinsightreportt = 'slds-nav-vertical__item';
                this.activeClassrequestevent = 'slds-nav-vertical__item';
                this.activeClassrequestinsightreport = 'slds-nav-vertical__item';
        }
        callregisteredevent() {
                this.registeredeventvar = true;
                this.showtable = false;
                this.portfoliovar = false;
                this.insightreporttvar = false;
                this.requesteventvar = false;
                this.requestinsightreportvar = false;
                this.eventbool = false;
                this.activeClassregisteredevent = 'slds-nav-vertical__item slds-is-active';
                this.activeClassinsightreportt = 'slds-nav-vertical__item';
                this.activeClassrequestevent = 'slds-nav-vertical__item';
                this.activeClassrequestinsightreport = 'slds-nav-vertical__item';
                this.activeClassschedule = 'slds-nav-vertical__item';
                this.activeClassportfolio = 'slds-nav-vertical__item';
        }
        callinsightreport() {
                this.insightreporttvar = true;
                this.registeredeventvar = false;
                this.showtable = false;
                this.portfoliovar = false;
                this.requesteventvar = false;
                this.requestinsightreportvar = false;
                this.eventbool = false;
                this.activeClassinsightreportt = 'slds-nav-vertical__item slds-is-active';
                this.activeClassregisteredevent = 'slds-nav-vertical__item';
                this.activeClassrequestevent = 'slds-nav-vertical__item';
                this.activeClassrequestinsightreport = 'slds-nav-vertical__item';
                this.activeClassschedule = 'slds-nav-vertical__item';
                this.activeClassportfolio = 'slds-nav-vertical__item';
        }
        requestevent() {
                this.requesteventvar = true;
                this.insightreporttvar = false;
                this.registeredeventvar = false;
                this.showtable = false;
                this.portfoliovar = false;
                this.requestinsightreportvar = false;
                this.eventbool = false;
                this.activeClassrequestevent = 'slds-nav-vertical__item slds-is-active';
                this.activeClassinsightreportt = 'slds-nav-vertical__item';
                this.activeClassregisteredevent = 'slds-nav-vertical__item';
                this.activeClassrequestinsightreport = 'slds-nav-vertical__item';
                this.activeClassschedule = 'slds-nav-vertical__item';
                this.activeClassportfolio = 'slds-nav-vertical__item';
        }
        requestinsightreport() {
                this.requestinsightreportvar = true;
                this.requesteventvar = false;
                this.insightreporttvar = false;
                this.registeredeventvar = false;
                this.showtable = false;
                this.portfoliovar = false;
                this.eventbool = false;
                this.activeClassrequestinsightreport = 'slds-nav-vertical__item slds-is-active';
                this.activeClassrequestevent = 'slds-nav-vertical__item';
                this.activeClassinsightreportt = 'slds-nav-vertical__item';
                this.activeClassregisteredevent = 'slds-nav-vertical__item';
                this.activeClassschedule = 'slds-nav-vertical__item';
                this.activeClassportfolio = 'slds-nav-vertical__item';
        }
}