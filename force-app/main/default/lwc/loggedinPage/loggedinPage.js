import { LightningElement,api,wire} from 'lwc';
import getEventList from '@salesforce/apex/skitsoHandler.getEventList';
import addmembertocampaign from '@salesforce/apex/skitsoHandler.addmembertocampaign';

const columns = [
    { label: 'Subject', fieldName: 'Subject',type:'text' },
    { label: 'Start Time', fieldName: 'StartDateTime',type:'date' },
    {  label: 'End Date', fieldName: 'EndDateTime',type:'date' }
    
];


export default class LoggedinPage extends LightningElement {

   
    @api showevent;
    @api pinvalue;
    @api contactid;
 
    
// JS Properties 
pageSizeOptions = [25, 50, 75, 100]; //Page size options
records = []; //All records available in the data table
//columns = []; //columns information available in the data table
totalRecords = 0; //Total no.of records
pageSize; //No.of records to be displayed per page
totalPages; //Total no.of pages
pageNumber = 1; //Page number    
isShowModal;
eventDesc;
getsubject;
modalSubject;
modalDescription;
subval;
desval;
//recordsToDisplay = []; //Records to be displayed on the page

get bDisableFirst() {
    return this.pageNumber == 1;
}
get bDisableLast() {
    return this.pageNumber == this.totalPages;
}

    eventList = [];
    columns = columns;


    handleRecordsPerPage(event) {
        this.pageSize = event.target.value;
        this.paginationHelper();
    }
    previousPage() {
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }
    nextPage() {
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }
    firstPage() {
        this.pageNumber = 1;
        this.paginationHelper();
    }
    lastPage() {
        this.pageNumber = this.totalPages;
        this.paginationHelper();
    }
    // JS function to handel pagination logic 
    paginationHelper() {
        this.eventList = [];
        // calculate total pages
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        // set page number 
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }
        // set records to display on current page 
        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecords) {
                break;
            }
            this.eventList.push(this.records[i]);
        }
    }

    getSelectedRow(event){
        const selectedRows = event.detail.selectedRows;
        this.modalDescription = selectedRows[0].Description;
        this.modalSubject = selectedRows[0].Subject;
    }
            
      @wire(getEventList)
      eventTable({error, data}){
      if(data)
           {
                this.eventList = data;
                this.records = data;
                this.eventDesc = data.description;
                this.totalRecords = data.length; // update total records count   
                        
                this.pageSize = this.pageSizeOptions[0]; //set pageSize with default value as first option
                this.paginationHelper(); // call helper menthod to update pagination logic 
               this.getsubject = JSON.stringify(this.records[0].Subject);
               
            }
           else if(error) {
                console.error('Error fetching data: ', error);
            }
    }

    registerCampaign(){
        this.isShowModal = true;
        console.log('show wire outside+2'+ this.getsubject);
        this.subval =  this.modalSubject;
        this.desval = this.modalDescription;
    }

    
        addcampaign(){
        this.isShowModal = false;
        addmembertocampaign({conid: this.contactid})
        .then((result) => {
          console.log('result'+JSON.stringify(result));
        })
        .catch((error) => {
          this.error = error;
        });

        this.template.querySelector('c-common-toast').showToast('success','Campaign member added successfully','utility:check',10000);
       
    }
    hideModalBox() {  
        this.isShowModal = false;
    }

    loadMoreData(event) {
        //Display a spinner to signal that data is being loaded
        event.target.isLoading = true;
        //Display "Loading" when more data is being loaded
        this.loadMoreStatus = 'Loading';
        fetchData(50).then((data) => {
            if (data.length >= this.totalNumberOfRows) {
                event.target.enableInfiniteLoading = false;
                this.loadMoreStatus = 'No more data to load';
            } else {
                const currentData = this.data;
                //Appends new data to the end of the table
                const newData = currentData.concat(data);
                this.data = newData;
                this.loadMoreStatus = '';
            }
            event.target.isLoading = false;
        });
    }

    }