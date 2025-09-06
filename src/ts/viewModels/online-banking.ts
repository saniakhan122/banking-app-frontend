import * as ko from "knockout";
import * as Bootstrap from "ojs/ojbootstrap";
import "oj-c/input-text";
import "oj-c/input-password";
import "oj-c/input-number";
import "oj-c/form-layout";
import "oj-c/button";
import "ojs/ojknockout";
import rootViewModel from '../appController';
import userContext from "../userContext";  // ⭐ import userContext

interface RegisterInternetBankingDTO {
  customerId: string;
  accountNumber: string;
  loginPassword: string;
  confirmLoginPassword: string;
  transactionPassword: string;
  confirmTransactionPassword: string;
  otp: string;
}

class RegisterInternetBankingViewModel {
  customerId: ko.Observable<string>;
  accountNumber: ko.Observable<string>;
  loginPassword: ko.Observable<string>;
  confirmLoginPassword: ko.Observable<string>;
  transactionPassword: ko.Observable<string>;
  confirmTransactionPassword: ko.Observable<string>;
  otp: ko.Observable<string>;

  errorMessage: ko.Observable<string>;
  successMessage: ko.Observable<string>;

  constructor() {
    this.customerId = ko.observable("");
    this.accountNumber = ko.observable("");
    this.loginPassword = ko.observable("");
    this.confirmLoginPassword = ko.observable("");
    this.transactionPassword = ko.observable("");
    this.confirmTransactionPassword = ko.observable("");
    this.otp = ko.observable("");

    this.errorMessage = ko.observable("");
    this.successMessage = ko.observable("");
  }

  public submitRegistration = async (event: Event) => {
    event.preventDefault();
    this.errorMessage("");
    this.successMessage("");

    // Basic client-side validation
    if (!this.customerId()) {
      this.errorMessage("Please enter Customer ID.");
      return;
    }
    if (!this.accountNumber()) {
      this.errorMessage("Please enter Account Number.");
      return;
    }
    if (!this.loginPassword()) {
      this.errorMessage("Please enter Login Password.");
      return;
    }
    if (this.loginPassword() !== this.confirmLoginPassword()) {
      this.errorMessage("Login passwords do not match.");
      return;
    }
    if (!this.transactionPassword()) {
      this.errorMessage("Please enter Transaction Password.");
      return;
    }
    if (this.transactionPassword() !== this.confirmTransactionPassword()) {
      this.errorMessage("Transaction passwords do not match.");
      return;
    }
    if (!this.otp()) {
      this.errorMessage("Please enter the OTP.");
      return;
    }

    const dto: RegisterInternetBankingDTO = {
      customerId: this.customerId(),
      accountNumber: this.accountNumber(),
      loginPassword: this.loginPassword(),
      confirmLoginPassword: this.confirmLoginPassword(),
      transactionPassword: this.transactionPassword(),
      confirmTransactionPassword: this.confirmTransactionPassword(),
      otp: this.otp(),
    };

    console.log("Registration DTO being sent:", dto);
console.log("JSON stringified payload:", JSON.stringify(dto)); // Shows how it looks "on the wire"

    try {
      const response = await fetch(
        "http://localhost:9090/banking-web/webapi/v1/customer-login/register-internet-banking",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dto),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        this.errorMessage("Server error: " + errText);
        return;
      }

      const data = await response.json();

      if (data.success) {
        this.successMessage(data.message || "Registration successful! Now you can access online banking services after login");
// rootViewModel.router?.go({ path: 'dashboard' });
        
      } else {
        this.errorMessage(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration request failed", err);
      this.errorMessage("Network error. Please try again.");
    }
  };
}

Bootstrap.whenDocumentReady().then(() => {
  const container = document.getElementById("form-container89");
  if (container) {
    ko.applyBindings(new RegisterInternetBankingViewModel(), container);
  } else {
    console.error("Form container element not found for KO bindings.");
  }
});

export = RegisterInternetBankingViewModel;
