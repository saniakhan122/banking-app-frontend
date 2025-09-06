import * as ko from 'knockout';
import 'oj-c/input-text';
import 'oj-c/input-number';
import 'oj-c/select-single';
import 'oj-c/form-layout';
import 'oj-c/button';
import 'ojs/ojknockout';
import { whenDocumentReady } from 'ojs/ojbootstrap';
import rootViewModel from '../appController';
import ArrayDataProvider = require('ojs/ojarraydataprovider');
import userContext from '../userContext';


interface TransferMethodOption {
  label: string;
  value: string;
}

class FundTransferViewModel {
  fromAccount: ko.Observable<string>;
  toAccount: ko.Observable<string>;
  amount: ko.Observable<number | null>;
  method: ko.Observable<string>;
  remarks: ko.Observable<string>;
transferMethodsDP: ArrayDataProvider<TransferMethodOption, string>;
  errorMessage: ko.Observable<string>;
  successMessage: ko.Observable<string>;
  submitting: ko.Observable<boolean>;


  constructor() {
    this.fromAccount = ko.observable('');
    this.toAccount = ko.observable('');
    this.amount = ko.observable(null);
    this.method = ko.observable('');
    this.remarks = ko.observable('');
    this.submitting = ko.observable(false);
    

    this.transferMethodsDP = new ArrayDataProvider(
  [
    { label: 'NEFT', value: 'NEFT' },
    { label: 'RTGS', value: 'RTGS' },
    { label: 'IMPS', value: 'IMPS' }
  ],
  { keyAttributes: "value" }
);


    this.errorMessage = ko.observable('');
    this.successMessage = ko.observable('');
  }

  public submitFundTransfer = async (event: Event) => {
    event.preventDefault();

    this.errorMessage('');
    this.successMessage('');
    this.submitting(true);

    const requestBody = {
      fromAccount: this.fromAccount(),
      toAccount: this.toAccount(),
      amount: this.amount(),
      method: this.method(),
      remarks: this.remarks(),
        customerId: userContext.customerId()   // ✅ add from shared state

    };

    if (!requestBody.fromAccount || !requestBody.toAccount || !requestBody.amount || !requestBody.method) {
      this.errorMessage('Please fill in all required fields.');
      this.submitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:9090/banking-web/webapi/v1/banking/fund-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.successMessage(data.message || 'Transfer successful.');
        // Reset form fields
        this.fromAccount('');
        this.toAccount('');
        this.amount(null);
        this.method('');
        this.remarks('');
      } else {
        this.errorMessage(data.error || 'Transfer failed.');
      }
    } catch (err) {
      console.error('Fund transfer error:', err);
      this.errorMessage('Unable to complete transfer. Please try again later.');
    } finally {
      this.submitting(false);
    }
  };
}

// Apply Knockout bindings once the DOM content is loaded and #form-container element is present
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('form-container');
  if (container) {
    ko.applyBindings(new FundTransferViewModel(), container);
  } else {
    console.error('Form container element not found for KO bindings.');
  }
});

export = FundTransferViewModel;
