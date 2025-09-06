// import * as ko from 'knockout';
// import * as Bootstrap from 'ojs/ojbootstrap';
// import { RESTDataProvider } from 'ojs/ojrestdataprovider';
// import 'ojs/ojknockout';
// import 'ojs/ojtable';

// // Define type for pending request
// type PendingRequest = {
//   requestId: string;
//   fullName: string;
//   mobileNumber: string;
//   email: string;
//   accountType: string;
//   status: string;
//   submittedAt: string;
// };
// type K = PendingRequest['requestId'];

// class AdminDashboardViewModel {
//   readonly pendingRequestsDP: RESTDataProvider<K, PendingRequest>;

//   constructor() {
//     this.pendingRequestsDP = new RESTDataProvider<K, PendingRequest>({
//       keyAttributes: 'requestId',
//       url: 'http://localhost:9090/banking-web/webapi/v1/account-requests/pending', // 👈 Your API endpoint
//       transforms: {
//         fetchFirst: {
//           request: async (options) => {
//             const url = new URL(options.url);
//             return new Request(url.href);
//           },
//           response: async ({ body }) => {
//             const data = body as PendingRequest[];
//             return { data };
//           }
//         }
//       }
//     });
//   }
// }

// export = AdminDashboardViewModel;

import * as ko from 'knockout';
import * as Bootstrap from 'ojs/ojbootstrap';
import { RESTDataProvider } from 'ojs/ojrestdataprovider';
import 'ojs/ojknockout';
import 'ojs/ojtable';
import rootViewModel from '../appController';


type PendingRequest = {
  requestId: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  accountType: string;
  status: string;
  submittedAt: string;
};
type K = PendingRequest['requestId'];

// DTO for approve and reject requests
interface ApproveRequestDTO {
  requestId: string;
  username: string;  // Admin username or identifier
}
interface RejectRequestDTO {
  requestId: string;
  username: string;  // Admin username or identifier
  reason: string;
}

class AdminDashboardViewModel {
  readonly pendingRequestsDP: RESTDataProvider<K, PendingRequest>;
  adminUsername: ko.Observable<string>;  // Store logged-in admin username if available

  constructor() {
    this.adminUsername = ko.observable('adminUser'); // Set this from your login context

    this.pendingRequestsDP = new RESTDataProvider<K, PendingRequest>({
      keyAttributes: 'requestId',
      url: 'http://localhost:9090/banking-web/webapi/v1/account-requests/pending',
      transforms: {
        fetchFirst: {
          request: async (options) => {
            const url = new URL(options.url);
            return new Request(url.href);
          },
          response: async ({ body }) => {
            const data = body as PendingRequest[];
            return { data };
          }
        }
      }
    });
  }

  approveAction = async (event: Event, context: any) => {
    const rowData = context.row;
    const requestId = rowData.requestId;

    const dto: ApproveRequestDTO = {
      requestId: requestId,
      username: this.adminUsername()
    };

    try {
      const response = await fetch('http://localhost:9090/banking-web/webapi/v1/account-requests/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dto)
      });

      if (response.ok) {
        alert(`Request ${requestId} approved successfully.`);
        this.refreshData();
      } else {
        alert(`Failed to approve request ${requestId}`);
      }
    } catch (error) {
      console.error('Approval error:', error);
      alert('Error occurred during approval.');
    }
  };

  rejectAction = async (event: Event, context: any) => {
    const rowData = context.row;
    const requestId = rowData.requestId;

    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    const dto: RejectRequestDTO = {
      requestId: requestId,
      username: this.adminUsername(),
      reason: reason
    };

    try {
      const response = await fetch('http://localhost:9090/banking-web/webapi/v1/account-requests/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dto)
      });

      if (response.ok) {
        alert(`Request ${requestId} rejected.`);
        this.refreshData();
      } else {
        alert(`Failed to reject request ${requestId}`);
      }
    } catch (error) {
      console.error('Rejection error:', error);
      alert('Error occurred during rejection.');
    }
  };
  goToApprovalForm = () => {
    // Use router to navigate to the approval form view
    rootViewModel.router?.go({ path: 'approval-form' });
  };

  goToLockedAccounts= () => {
    // Use router to navigate to the approval form view
    rootViewModel.router?.go({ path: 'locked-accounts' });
  };

  private refreshData() {
    this.pendingRequestsDP.refresh();
  }
}


export = AdminDashboardViewModel;

