import * as ko from 'knockout';
import * as Bootstrap from 'ojs/ojbootstrap';
import 'oj-c/input-text';
import 'oj-c/form-layout';
import 'oj-c/button';
import 'ojs/ojknockout';

interface ApproveRequestDTO {
  requestId: string;
  username: string;
}
interface RejectRequestDTO {
  requestId: string;
  username: string;
  reason: string;
}

class ApprovalFormViewModel {
  requestId: ko.Observable<string>;
  adminUsername: ko.Observable<string>;
  reason: ko.Observable<string>;
  errorMessage: ko.Observable<string>;

  constructor() {
    this.requestId = ko.observable("");
    this.adminUsername = ko.observable("adminUser"); // can be set from login context
    this.reason = ko.observable("");
    this.errorMessage = ko.observable("");
  }

  // ✅ Approve Request
  public approveAction = async (event: Event) => {
    event.preventDefault();

    const dto: ApproveRequestDTO = {
      requestId: this.requestId(),
      username: this.adminUsername()
    };

    try {
      const response = await fetch("http://localhost:9090/banking-web/webapi/v1/account-requests/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto)
      });

      if (response.ok) {
        const data = await response.json();
        if (data==true) {
          alert(`Request ${this.requestId()} approved successfully.`);
          this.clearForm();
        } else {
          this.errorMessage(data.error || "Approval failed.");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        this.errorMessage(errorData.error || "Approval failed due to server error.");
      }
    } catch (err) {
      console.error("Approval request failed", err);
      this.errorMessage("Unable to connect to server.");
    }
  };

  // ❌ Reject Request
  public rejectAction = async (event: Event) => {
    event.preventDefault();

    if (!this.reason()) {
      this.errorMessage("Rejection reason is required.");
      return;
    }

    const dto: RejectRequestDTO = {
      requestId: this.requestId(),
      username: this.adminUsername(),
      reason: this.reason()
    };

    try {
      const response = await fetch("http://localhost:9090/banking-web/webapi/v1/account-requests/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto)
      });

      if (response.ok) {
        const data = await response.json();
        if (data==true) {
          alert(`Request ${this.requestId()} rejected successfully.`);
          this.clearForm();
        } else {
          this.errorMessage(data.error || "Rejection failed.");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        this.errorMessage(errorData.error || "Rejection failed due to server error.");
      }
    } catch (err) {
      console.error("Rejection request failed", err);
      this.errorMessage("Unable to connect to server.");
    }
  };

  // Reset form fields
  private clearForm() {
    this.requestId("");
    this.reason("");
    this.errorMessage("");
  }
}

// Apply Knockout bindings once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('form-container');
  if (container) {
    ko.applyBindings(new ApprovalFormViewModel(), container);
  } else {
    console.error("Form container element not found for KO bindings.");
  }
});

export = ApprovalFormViewModel;
