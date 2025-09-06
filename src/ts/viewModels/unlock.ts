import * as ko from "knockout";
import * as Bootstrap from "ojs/ojbootstrap";
import "oj-c/input-text";
import "oj-c/form-layout";
import "oj-c/button";
import "ojs/ojknockout";

// ✅ DTO for unlock account
interface UnlockRequestDTO {
  customerId: string;
}

class UnlockAccountViewModel {
  customerId: ko.Observable<string>;
  errorMessage: ko.Observable<string>;
  successMessage: ko.Observable<string>;

  constructor() {
    this.customerId = ko.observable("");
    this.errorMessage = ko.observable("");
    this.successMessage = ko.observable("");
  }

  public unlockAccount = async (event: Event) => {
    event.preventDefault();
    this.errorMessage("");
    this.successMessage("");

    const dto: UnlockRequestDTO = {
      customerId: this.customerId()
    };

    if (!dto.customerId) {
      this.errorMessage("Please enter a Customer ID.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:9090/banking-web/webapi/v1/customer-login/unlock",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dto),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        this.successMessage(data.message || "Account unlocked successfully!");
      } else {
        this.errorMessage(data.message || "Failed to unlock account.");
      }
    } catch (err) {
      console.error("Unlock request failed", err);
      this.errorMessage("Unable to connect to server.");
    }
  };
}

// Apply Knockout bindings once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("form-container");
  if (container) {
    ko.applyBindings(new UnlockAccountViewModel(), container);
  } else {
    console.error("Form container element not found for KO bindings.");
  }
});

export = UnlockAccountViewModel;
