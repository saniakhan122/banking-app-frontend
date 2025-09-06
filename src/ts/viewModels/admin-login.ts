import * as ko from 'knockout';
import * as Bootstrap from 'ojs/ojbootstrap';
import 'oj-c/input-text';
import 'oj-c/input-password';
import 'oj-c/form-layout';
import 'oj-c/button';
import 'ojs/ojknockout';
import rootViewModel from '../appController';

class AdminLoginViewModel {
  username: ko.Observable<string>;
  password: ko.Observable<string>;
  errorMessage: ko.Observable<string>;

  constructor() {
    this.username = ko.observable("");
    this.password = ko.observable("");
    this.errorMessage = ko.observable("");
  }

  public loginAction = async (event: Event) => {
    event.preventDefault();
    this.errorMessage("");

    const requestBody = {
      username: this.username(),
      password: this.password()
    };

    try {
      const response = await fetch("http://localhost:9090/banking-web/webapi/v1/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Navigate to admin dashboard or appropriate page on successful login
          rootViewModel.router?.go({ path: 'admin-dashboard' });
        } else {
          this.errorMessage(data.error || "Invalid admin credentials");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        this.errorMessage(errorData.error || "Admin login failed. Please try again.");
      }
    } catch (err) {
      console.error("Admin login request failed", err);
      this.errorMessage("Unable to connect to server.");
    }
  };
}

// Apply Knockout bindings once DOM content is loaded and container exists
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("form-container");
  if (container) {
    ko.applyBindings(new AdminLoginViewModel(), container);
  } else {
    console.error("Form container element not found for KO bindings.");
  }
});

export = AdminLoginViewModel;
