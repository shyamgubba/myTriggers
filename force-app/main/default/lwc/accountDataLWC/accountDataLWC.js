import { LightningElement, wire, api,track } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import updateRecord from '@salesforce/apex/AccountController.updateRecord';
const columns = [
    { label: 'Account Name', fieldName: 'Name' },
    { label: 'Industry', fieldName: 'Industry' },
    { label: 'Type', fieldName: 'Type' },
    { label: 'Phone', fieldName: 'Phone' },
    { label: 'Selected', fieldName: 'Selected__c', type: 'boolean' }
];
export default class AccountDataLWC extends LightningElement {

    @api recordId;
    columns = columns;
    selectedRows;
    accounts;
    selectedValue;
    selectedIds = []

    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;
        } else if (error) {
            console.error(error);
        }
    }

    handleSelectRow(e){
        this.selectedRows = e.detail.selectedRows;
        console.log('Selected Rows '+JSON.stringify(this.selectedRows))
        this.selectedRows.forEach(currentItem => {
            this.selectedIds.push(currentItem.Id)
            this.selectedValue = currentItem.Selected__c;
            console.log('Selected Id '+JSON.stringify(this.selectedIds))
            console.log('Selected Value '+JSON.stringify(currentItem.Selected__c))
        });
    }

    handleClick(){
        updateRecord({ recordIds: this.selectedIds,truefalse:this.selectedValue})
            .then(result => {
                this.contacts = result;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.contacts = undefined;
            });
    }

}