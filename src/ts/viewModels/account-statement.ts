import * as ko from "knockout";
import * as Bootstrap from "ojs/ojbootstrap";
import "ojs/ojknockout";
import "oj-c/input-text";
import "oj-c/button";
import "oj-c/form-layout";
import "ojs/ojtable";  
import "ojs/ojdatetimepicker";
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import userContext from "../userContext";   // ✅ add import

// DTO for request
interface AccountStatementRequestDTO {
  accountNumber: string;
  customerId: string;   // ✅ include customerId
  fromDate: string;
  toDate: string;
}

// Transaction DTO
type Transaction = {
  transactionId: string;
  transactionDate: string;
  description: string;
  amount: number;
  openingBalance: number;
  closingBalance: number;
  status: string;
};

class AccountStatementViewModel {
  accountNumber = ko.observable<string>("");
  fromDate = ko.observable<string>("");
  toDate = ko.observable<string>("");
  errorMessage = ko.observable<string>("");

  transactions = ko.observableArray<Transaction>([]);
  transactionsDP: ArrayDataProvider<string, Transaction>;

  constructor() {
    this.transactionsDP = new ArrayDataProvider(this.transactions, {
      keyAttributes: "transactionId"
    });
  }

  fetchStatement = async () => {
    this.errorMessage("");
    this.transactions.removeAll();

    const accNum = this.accountNumber();
    const from = this.fromDate();
    const to = this.toDate();
    const customerId = userContext.customerId(); // ✅ fetch from shared context

    if (!accNum || !from || !to) {
      this.errorMessage("Please enter Account Number, From Date, and To Date.");
      return;
    }

    if (!customerId) {
      this.errorMessage("You must be logged in to view account statements.");
      return;
    }

    const dto: AccountStatementRequestDTO = {
      accountNumber: accNum,
      customerId: customerId,  // ✅ send along with request
      fromDate: from,
      toDate: to
    };

    try {
      const response = await fetch(
        "http://localhost:9090/banking-web/webapi/v1/banking/statement",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dto)
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        if (Array.isArray(data.transactions) && data.transactions.length > 0) {
          this.transactions(data.transactions);
        } else {
          this.errorMessage(data.message || "No transactions found for this period.");
        }
      } else {
        this.errorMessage(data.message || "Error fetching account statement.");
      }
    } catch (err) {
      console.error(err);
      this.errorMessage("Server error. Please try again later.");
    }
  };
}

Bootstrap.whenDocumentReady().then(() => {
  const rootNode = document.getElementById("accountStatementPage");
  if (rootNode) {
    ko.applyBindings(new AccountStatementViewModel(), rootNode);
  } else {
    console.error("Element 'accountStatementPage' not found for KO bindings.");
  }
});

export = AccountStatementViewModel;
