import * as ko from "knockout";
import * as Bootstrap from "ojs/ojbootstrap";
import "oj-c/input-text";
import "oj-c/form-layout";
import "oj-c/button";
import "ojs/ojknockout";
import userContext from "../userContext";

// ✅ DTO for request
interface BalanceRequestDTO {
  accountNumber: string;
  customerId: string;
}

class CheckBalanceViewModel {
  accountNumber: ko.Observable<string>;
  balance: ko.Observable<string>;
  errorMessage: ko.Observable<string>;

  constructor() {
    this.accountNumber = ko.observable("");
    this.balance = ko.observable("");
    this.errorMessage = ko.observable("");
  }

  public checkBalance = async (event: Event) => {
  event.preventDefault();
  this.errorMessage("");
  this.balance("");

  const customerId = userContext.customerId();
  if (!customerId) {
    this.errorMessage("You must be logged in to check balance.");
    return;
  }

  const dto: BalanceRequestDTO = {
    accountNumber: this.accountNumber(),
    customerId: customerId
  };

  if (!dto.accountNumber) {
    this.errorMessage("Please enter an account number.");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:9090/banking-web/webapi/v1/banking/balance",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      this.balance(`₹ ${data.balance}`);
    } else {
      this.errorMessage(data.message || "Unable to fetch balance.");
    }
  } catch (err) {
    console.error("Balance check failed", err);
    this.errorMessage("Unable to connect to server.");
  }
};

}

// Apply Knockout bindings once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("form-container");
  if (container) {
    ko.applyBindings(new CheckBalanceViewModel(), container);
  } else {
    console.error("Form container element not found for KO bindings.");
  }
});

export = CheckBalanceViewModel;
