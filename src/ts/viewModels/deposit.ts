import * as ko from "knockout";
import * as Bootstrap from "ojs/ojbootstrap";
import "oj-c/input-text";
import "oj-c/input-number";
import "oj-c/form-layout";
import "oj-c/button";
import "ojs/ojknockout";
import userContext from "../userContext";

// DTO for deposit request
interface DepositRequestDTO {
  accountNumber: string;
  amount: number; // or string, but number is better for input
  description?: string;
   customerId: string;   // ✅ include customerId

}

class DepositMoneyViewModel {
  accountNumber: ko.Observable<string>;
  amount: ko.Observable<number | null>;
  description: ko.Observable<string>;
  errorMessage: ko.Observable<string>;
  successMessage: ko.Observable<string>;

  constructor() {
    this.accountNumber = ko.observable("");
    this.amount = ko.observable(null);
    this.description = ko.observable("");
    this.errorMessage = ko.observable("");
    this.successMessage = ko.observable("");
  }

  // Deposit action
  public depositMoney = async (event: Event) => {
    event.preventDefault();
    this.errorMessage("");
    this.successMessage("");
        const customerId = userContext.customerId(); // ✅ fetch from shared context

           if (!customerId) {
      this.errorMessage("You must be logged in to view account statements.");
      return;
    }


    // DTO assembly & validation
    const dto: DepositRequestDTO = {
      accountNumber: this.accountNumber(),
      amount: this.amount() || 0, // Default to 0 if null
      description: this.description() || undefined,
            customerId: customerId,  // ✅ send along with request

    };

   

    // Basic validation
    if (!dto.accountNumber || dto.amount <= 0) {
      this.errorMessage("Please enter a valid account number and amount.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:9090/banking-web/webapi/v1/banking/deposit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dto),
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          this.successMessage(
            `₹${dto.amount} deposited to account ${dto.accountNumber} successfully.`
          );
          // Optionally, reset fields
          this.amount(null);
          this.description("");
        } else {
          this.errorMessage(data.message || "Deposit failed.");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        this.errorMessage(
          errorData.message || "Error making deposit. Please try again."
        );
      }
    } catch (err) {
      console.error("Deposit request failed", err);
      this.errorMessage("Unable to connect to server.");
    }
  };
}

// Apply Knockout bindings once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("deposit-form-container");
  if (container) {
    ko.applyBindings(new DepositMoneyViewModel(), container);
  } else {
    console.error("Form container element not found for KO bindings.");
  }
});

export = DepositMoneyViewModel;