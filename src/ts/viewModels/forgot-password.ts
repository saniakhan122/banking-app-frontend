import * as ko from "knockout";
import * as Bootstrap from "ojs/ojbootstrap";
import "oj-c/input-text";
import "oj-c/form-layout";
import "oj-c/button";
import "ojs/ojknockout";

// DTO for forgot password request
interface ForgotPasswordRequestDTO {
  customerId: string;
}

class ForgotPasswordViewModel {
  customerId: ko.Observable<string>;
  errorMessage: ko.Observable<string>;
  successMessage: ko.Observable<string>;

  constructor() {
    this.customerId = ko.observable("");
    this.errorMessage = ko.observable("");
    this.successMessage = ko.observable("");
  }

  // Submit forgot password request
  public submitForgotPassword = async (event: Event) => {
    event.preventDefault();
    this.errorMessage("");
    this.successMessage("");

    const dto: ForgotPasswordRequestDTO = {
      customerId: this.customerId().trim()
    };

    if (!dto.customerId) {
      this.errorMessage("Please enter your Customer ID.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:9090/banking-web/webapi/v1/customer-login/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dto),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        this.successMessage(data.message);
        this.customerId(""); // Optionally clear input
      } else {
        this.errorMessage(data.message || "Password reset failed.");
      }
    } catch (err) {
      console.error("Forgot password request failed", err);
      this.errorMessage("Unable to connect to server.");
    }
  };
}

// Apply Knockout bindings
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("forgot-password-form-container");
  if (container) {
    ko.applyBindings(new ForgotPasswordViewModel(), container);
  } else {
    console.error("Form container element not found for KO bindings.");
  }
});

export = ForgotPasswordViewModel;
