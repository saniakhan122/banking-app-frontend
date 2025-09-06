/**
 * @license
 * Copyright (c) 2014, 2024, Oracle
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
import * as AccUtils from "../accUtils";
import "ojs/ojinputtext";
import 'oj-c/input-password';
import rootViewModel from '../appController';
import userContext from '../userContext';
import "ojs/ojbutton";
import * as ArrayDataProvider from "ojs/ojarraydataprovider";
  import "oj-c/action-card";




class DashboardViewModel {
  // Expose the observables from userContext for easy data binding
  fullName = userContext.fullName;
  email = userContext.email;
  customerDetails = userContext.customerDetails;

  constructor() {
    // Log immediately on creation
    console.log('fullName:', this.fullName());
    console.log('email:', this.email());
    console.log('customerDetails:', this.customerDetails());
  }
  

    goToFundTransfer = () => {
      // Use router to navigate to the approval form view
      rootViewModel.router?.go({ path: 'fund-transfer' });
    };

    goToCheckBalance= () => {
      // Use router to navigate to the approval form view
      rootViewModel.router?.go({ path: 'check-balance' });
    };

    goToAccountStatement= () => {
      // Use router to navigate to the approval form view
      rootViewModel.router?.go({ path: 'account-statement' });
    };
  
    goToDeposit= () => {
      // Use router to navigate to the approval form view
      rootViewModel.router?.go({ path: 'deposit' });
    };

    goToWithdraw= () => {
      // Use router to navigate to the approval form view
      rootViewModel.router?.go({ path: 'withdraw' });
    };

    goToProfile= () => {
      // Use router to navigate to the approval form view
      rootViewModel.router?.go({ path: 'customer-details' });
    };

    goToChangePWD= () => {
      // Use router to navigate to the approval form view
      rootViewModel.router?.go({ path: 'change-password' });
    };

  logoutAction = async () => {
  // Clear user context
  userContext.customerId(null);
  userContext.customerDetails(null);
  userContext.fullName("");
  userContext.email("");

  // Redirect back to login page
  await rootViewModel.router?.go({ path: 'login' });
};
  

}

export = DashboardViewModel;