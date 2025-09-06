import * as ko from "knockout";
import * as Bootstrap from "ojs/ojbootstrap";
import "oj-c/input-text";
import "oj-c/input-number";
import "oj-c/form-layout";
import "oj-c/button";
import "ojs/ojknockout";
import userContext from "../userContext";

// DTO for withdraw request
interface WithdrawRequestDTO {
  accountNumber: string;
  amount: number;
  description?: string;
  customerId: string;   // ✅ include customerId

}

class WithdrawMoneyViewModel {
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

  // Withdraw action
  public withdrawMoney = async (event: Event) => {
    event.preventDefault();
    this.errorMessage("");
    this.successMessage("");
    const customerId = userContext.customerId(); // ✅ fetch from shared context

           if (!customerId) {
      this.errorMessage("You must be logged in to view account statements.");
      return;
    }


    // DTO assembly & validation
    const dto: WithdrawRequestDTO = {
      accountNumber: this.accountNumber(),
      amount: this.amount() || 0,
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
        "http://localhost:9090/banking-web/webapi/v1/banking/withdraw",
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
            `₹${dto.amount} withdrawn from account ${dto.accountNumber} successfully.`
          );
          // Optionally, reset fields
          this.amount(null);
          this.description("");
        } else {
          this.errorMessage(
            data.message ||
              "Withdraw failed. Please check balance and account status."
          );
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        this.errorMessage(
          errorData.message || "Error making withdrawal. Please try again."
        );
      }
    } catch (err) {
      console.error("Withdraw request failed", err);
      this.errorMessage("Unable to connect to server.");
    }
  };
}

// Apply Knockout bindings once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("withdraw-form-container");
  if (container) {
    ko.applyBindings(new WithdrawMoneyViewModel(), container);
  } else {
    console.error("Form container element not found for KO bindings.");
  }
});

export = WithdrawMoneyViewModel;