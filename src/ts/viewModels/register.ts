import * as ko from 'knockout';
import * as Bootstrap from 'ojs/ojbootstrap';
import 'oj-c/input-text';

// import "oj-c/input-date-picker";   // ✅ correct
import 'oj-c/input-number';
import 'oj-c/select-single';
import 'oj-c/form-layout';
import 'oj-c/button';
import 'ojs/ojknockout';
  import "oj-c/input-date-mask";
  import "ojs/ojdatetimepicker";




  import { whenDocumentReady } from 'ojs/ojbootstrap';
import ArrayDataProvider = require('ojs/ojarraydataprovider');

import rootViewModel from '../appController';

interface AccountTypeOption {
  label: string;
  value: string;
}

class AccountCreationViewModel {
  fullName: ko.Observable<string>;
  email: ko.Observable<string>;
  mobileNumber: ko.Observable<string>;
  // dateOfBirth: ko.Observable<string>;
  dateOfBirth = ko.observable("");

  aadharNumber: ko.Observable<string>;
  residentialAddress: ko.Observable<string>;
  permanentAddress: ko.Observable<string>;
  occupation: ko.Observable<string>;
  annualIncome: ko.Observable<number | null>;
  accountType: ko.Observable<string>;
  errorMessage: ko.Observable<string>;
  successMessage:ko.Observable<string>;
  accountTypesDP: ArrayDataProvider<AccountTypeOption, string>; // ✅ correct type
    submitting: ko.Observable<boolean>;


  constructor() {
    this.fullName = ko.observable("");
    this.email = ko.observable("");
    this.mobileNumber = ko.observable("");
        this.submitting = ko.observable(false);


  this.dateOfBirth = ko.observable("");  // No default date, user must enter
    this.aadharNumber = ko.observable("");
    this.residentialAddress = ko.observable("");
    this.permanentAddress = ko.observable("");
    this.occupation = ko.observable("");
    this.annualIncome = ko.observable(null);
    this.accountType = ko.observable("SAVINGS"); // default selected value
this.accountTypesDP = new ArrayDataProvider(
  [
    { label: "SAVINGS", value: "SAVINGS" },
    { label: "CURRENT", value: "CURRENT" }
  ],
  { keyAttributes: "value" }
);

    this.errorMessage = ko.observable("");
    this.successMessage=ko.observable("");
  }

  public submitApplication = async (event: Event) => {
    event.preventDefault();

    console.log("Submitting account creation with data:", {
      fullName: this.fullName(),
      email: this.email(),
      mobileNumber: this.mobileNumber(),
      dateOfBirth: this.dateOfBirth(),
      aadharNumber: this.aadharNumber(),
      residentialAddress: this.residentialAddress(),
      permanentAddress: this.permanentAddress(),
      occupation: this.occupation(),
      annualIncome: this.annualIncome(),
      accountType: this.accountType()
    });

    const requestBody = {
      fullName: this.fullName(),
      email: this.email(),
      mobileNumber: this.mobileNumber(),
      dateOfBirth: this.dateOfBirth(),
      aadharNumber: this.aadharNumber(),
      residentialAddress: this.residentialAddress(),
      permanentAddress: this.permanentAddress(),
      occupation: this.occupation(),
      annualIncome: this.annualIncome(),
      accountType: this.accountType()
    };

    try {
      const response = await fetch("http://localhost:9090/banking-web/webapi/v1/account-requests/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Success, navigate or inform user
          this.successMessage("Your request was submitted successfully. " +
    "Your Service Reference No is: " + data.serviceReferenceNo);

        } else {
          this.errorMessage(data.error || "Account creation failed");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        this.errorMessage(errorData.error || "Failed to submit application");
      }
    } catch (err) {
      console.error("Account creation request failed", err);
      this.errorMessage("Unable to connect to server.");
    } finally{
         this.submitting(false);
    }
  };
}

// Apply Knockout bindings once the DOM content is loaded and #form-container element is present
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("form-container");
  if (container) {
    ko.applyBindings(new AccountCreationViewModel(), container);
  } else {
    console.error("Form container element not found for KO bindings.");
  }
});

export = AccountCreationViewModel;
