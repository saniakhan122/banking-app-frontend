import * as ko from 'knockout';
import * as Bootstrap from 'ojs/ojbootstrap';
import 'oj-c/input-text';
import 'oj-c/input-password';
import 'oj-c/form-layout';
import 'oj-c/button';
import 'ojs/ojknockout';
import rootViewModel from '../appController';
import userContext from '../userContext';

// Login ViewModel using knockout observables for form fields and errors
class LoginViewModel {
  customerId: ko.Observable<string>;
  password: ko.Observable<string>;
  errorMessage: ko.Observable<string>;

  constructor() {
    this.customerId = ko.observable("");
    this.password = ko.observable("");
    this.errorMessage = ko.observable("");
  }

  public loginAction = async (event: Event) => {
    event.preventDefault();
    this.errorMessage(""); // Clear any old error message

    const requestBody = {
      customerId: this.customerId(),
      password: this.password()
    };

    try {
      // Step 1: POST to login endpoint
      const response = await fetch("http://localhost:9090/banking-web/webapi/v1/customer-login/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.customerId) {
          userContext.customerId(data.customerId); // Store id in user context

          // Step 2: Fetch full customer details
          const detailsRes = await fetch("http://localhost:9090/banking-web/webapi/v1/customers/customerDetails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ customerId: data.customerId })
          });

          if (detailsRes.ok) {
            const customerDetails = await detailsRes.json();
            // Here, we assign the raw object with correct property names
            userContext.customerDetails(customerDetails);
            userContext.fullName(customerDetails.fullName || "");
            userContext.email(customerDetails.email || "");


  // Step 3: Check if Internet Banking is enabled
          const internetBankingRes = await fetch("http://localhost:9090/banking-web/webapi/v1/customer-login/is-internet-banking-enabled", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerId: data.customerId })
          });

          if (internetBankingRes.ok) {
            const enabledData = await internetBankingRes.json();
            if (enabledData.enabled === true) {
              // Internet banking enabled, navigate to dashboard
              rootViewModel.router?.go({ path: 'dashboard' });
            } else {
          window.alert("Internet Banking is currently disabled for your account. You are being redirected to the Online Banking Registration page.");
    rootViewModel.router?.go({ path: 'online-banking' });
            }
          } else {
            this.errorMessage("Failed to verify internet banking status.");
          }
        } else {
          const errDet = await detailsRes.json().catch(() => ({}));
          this.errorMessage(errDet.error || "Failed to fetch customer details.");
        }
      } else {
        this.errorMessage(data.error || "Invalid login credentials");
      }
    } else {
      const errorData = await response.json().catch(() => ({}));
      this.errorMessage(errorData.error || "Login failed. Please try again.");
    }
  } catch (err) {
    console.error("Login request failed", err);
    this.errorMessage("Unable to connect to server.");
  }
};

forgotPassword = () => {
      // Use router to navigate to the approval form view
      rootViewModel.router?.go({ path: 'forgot-password' });
    };


forgotCustomerId= () => {
      // Use router to navigate to the approval form view
      rootViewModel.router?.go({ path: 'forgot-customerId' });
    };

}

// Apply Knockout bindings on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('form-container');
  if (container) {
    ko.applyBindings(new LoginViewModel(), container);
  } else {
    console.error("Form container element not found for KO bindings.");
  }
});



export = LoginViewModel;
