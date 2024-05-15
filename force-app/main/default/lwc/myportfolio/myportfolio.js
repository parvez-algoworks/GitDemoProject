import { LightningElement, api } from 'lwc';
export default class Myportfolio extends LightningElement {
    @api showportfolio;
    @api conttoupdate;
    showportfoliomodal;
    tableToHeader;
    searchedPortfolioTable = [];
    tabValue = 'Portfolio';
    tabIcon = 'utility:user';
    loadChild = false;
    editportfolio() {
        this.showportfoliomodal = true;
    }
    hidemodal(event) {
        this.showportfoliomodal = event.detail.value;
    }
    closemodal(event){
        this.showportfoliomodal = event.detail.value;
    }
    updatePortfolioTable(event){
    this.template.querySelector('c-portfoliotable').refreshTable();
    }
    portfolioDatatable(event){
         this.portfolioAllCampaign = event.detail.value;
    }
    searchitemintable(event) {
        this.searchedPortfolioTable = event.detail.value;
        this.loadChild = true;
    }
    clearitemtable(event) {
        this.searchedPortfolioTable = event.detail.value;
        this.template.querySelector('c-portfoliotable').refreshTable();
    }
}