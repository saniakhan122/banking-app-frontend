import * as ko from 'knockout';

// Shared user state for the entire app
class UserContext {
  customerId = ko.observable<string|null>(null);         // set after login
  fullName = ko.observable<string|null>(null);           // set after details fetch
  email = ko.observable<string|null>(null);              // set after details fetch
  customerDetails = ko.observable<any>(null);            // stores the full customer object

  // Add more observables as needed, e.g. token, session, roles
  // sessionToken = ko.observable<string|null>(null);

  // Helper: clear user info when logging out, etc.
  clear() {
    this.customerId(null);
    this.fullName(null);
    this.email(null);
    this.customerDetails(null);
  }
}

// Always export a single instance!
const userContext = new UserContext();
export default userContext;
