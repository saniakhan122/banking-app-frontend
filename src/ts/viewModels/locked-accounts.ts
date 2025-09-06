import * as ko from 'knockout';
import * as Bootstrap from 'ojs/ojbootstrap';
import { RESTDataProvider } from 'ojs/ojrestdataprovider';
import 'ojs/ojknockout';
import 'ojs/ojtable';
import rootViewModel from '../appController';

type LockedAccount = {
  customerId: string;
  userId: string;
  failedLoginAttempts: number;
  lockedUntil: string;
  lastLogin: string;
};
type K = LockedAccount['customerId'];

class LockedAccountsViewModel {
  readonly lockedAccountsDP: RESTDataProvider<K, LockedAccount>;
  adminUsername: ko.Observable<string>;

  constructor() {
    this.adminUsername = ko.observable('adminUser'); // Use from session if available

    // Setup RESTDataProvider for locked accounts
    this.lockedAccountsDP = new RESTDataProvider<K, LockedAccount>({
      keyAttributes: 'customerId',
      url: 'http://localhost:9090/banking-web/webapi/v1/customer-login/locked-accounts',
      transforms: {
        fetchFirst: {
          request: async (options) => {
            const url = new URL(options.url);
            return new Request(url.href);
          },
          response: async ({ body }) => {
            const data = body as LockedAccount[];
            return { data };
          }
        }
      }
    });
  }

  goToDashboard = () => {
    rootViewModel.router?.go({ path: 'admin-dashboard' });
  };

  private refreshData() {
    this.lockedAccountsDP.refresh();
  }

      goToUnlock= () => {
        // Use router to navigate to the approval form view
        rootViewModel.router?.go({ path: 'unlock' });
      };
}

Bootstrap.whenDocumentReady().then(() => {
  const elem = document.getElementById('mainContent12');
  if (elem) {
    ko.applyBindings(new LockedAccountsViewModel(), elem);
  } else {
    console.error("Element with id 'mainContent' not found.");
  }
});

export = LockedAccountsViewModel;
