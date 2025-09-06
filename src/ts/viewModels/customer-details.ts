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

class DetailsViewModel {
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
  
  

}

export = DetailsViewModel;