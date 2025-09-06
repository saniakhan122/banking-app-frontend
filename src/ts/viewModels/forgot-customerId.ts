import * as ko from "knockout";
import * as Bootstrap from "ojs/ojbootstrap";
import "oj-c/input-text";
import "oj-c/form-layout";
import "oj-c/button";
import "ojs/ojknockout";

// DTO for forgot customer ID request
interface ForgotCustomerIdRequestDTO {
  email: string;
}

class ForgotCustomerIdViewModel {
  email: ko.Observable<string>;
  errorMessage: ko.Observable<string>;
  successMessage: ko.Observable<string>;

  constructor() {
    this.email = ko.observable("");
    this.errorMessage = ko.observable("");
    this.successMessage = ko.observable("");
  }

  // Submit forgot customer ID request
  public submitForgotCustomerId = async (event: Event) => {
    event.preventDefault();
    this.errorMessage("");
    this.successMessage("");

    const dto: ForgotCustomerIdRequestDTO = {
      email: this.email().trim()
    };

    if (!dto.email) {
      this.errorMessage("Please enter your registered email.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:9090/banking-web/webapi/v1/customer-login/forgot-customer-id",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dto),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        this.successMessage(data.message);
        this.email(""); // Optionally clear input
      } else {
        this.errorMessage(data.message || "Request failed.");
      }
    } catch (err) {
      console.error("Forgot customer ID request failed", err);
      this.errorMessage("Unable to connect to server.");
    }
  };
}

// Apply Knockout bindings
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("forgot-customer-id-form-container");
  if (container) {
    ko.applyBindings(new ForgotCustomerIdViewModel(), container);
  } else {
    console.error("Form container element not found for KO bindings.");
  }
});

export = ForgotCustomerIdViewModel;
