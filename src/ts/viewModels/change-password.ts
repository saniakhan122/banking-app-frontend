import * as ko from "knockout";
import * as Bootstrap from "ojs/ojbootstrap";
import "oj-c/input-password";
import "oj-c/form-layout";
import "oj-c/button";
import "ojs/ojknockout";
import userContext from "../userContext";

// ✅ DTO for request
interface ChangePasswordDTO {
  customerId: string;
  oldPassword: string;
  newPassword: string;
}

class ChangePasswordViewModel {
  oldPassword: ko.Observable<string>;
  newPassword: ko.Observable<string>;
  confirmPassword: ko.Observable<string>;
  errorMessage: ko.Observable<string>;
  successMessage: ko.Observable<string>;

  constructor() {
    this.oldPassword = ko.observable("");
    this.newPassword = ko.observable("");
    this.confirmPassword = ko.observable("");
    this.errorMessage = ko.observable("");
    this.successMessage = ko.observable("");
  }

  public changePassword = async (event: Event) => {
    event.preventDefault();
    this.errorMessage("");
    this.successMessage("");

    const customerId = userContext.customerId();
    if (!customerId) {
      this.errorMessage("You must be logged in to change password.");
      return;
    }

    if (!this.oldPassword() || !this.newPassword() || !this.confirmPassword()) {
      this.errorMessage("All fields are required.");
      return;
    }

    if (this.newPassword() !== this.confirmPassword()) {
      this.errorMessage("New Password and Confirm Password do not match.");
      return;
    }

    const dto: ChangePasswordDTO = {
      customerId: customerId,
      oldPassword: this.oldPassword(),
      newPassword: this.newPassword(),
    };

    try {
      const response = await fetch(
        "http://localhost:9090/banking-web/webapi/v1/customer-login/change-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dto),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        this.successMessage("Password changed successfully.");
        this.oldPassword("");
        this.newPassword("");
        this.confirmPassword("");
      } else {
        this.errorMessage(data.error || "Password change failed.");
      }
    } catch (err) {
      console.error("Change password failed", err);
      this.errorMessage("Unable to connect to server.");
    }
  };
}

// Apply Knockout bindings once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("changePasswordForm-container");
  if (container) {
    ko.applyBindings(new ChangePasswordViewModel(), container);
  } else {
    console.error("Form container element not found for KO bindings.");
  }
});

export = ChangePasswordViewModel;
