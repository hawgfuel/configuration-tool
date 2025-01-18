import React from 'react';
import Microfrontend from '@partnerincentives/microfrontend';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@partnercenter-react/ui-webcore';
import { UserPrivilegesProvider } from '@partnerincentives/engagements-common';
import { EngagementsConfigApp } from './engagements-config-app';

// add useMockClient property to EngagementsConfigApp for mockdata
window.customElements.define('engagements-config-app',
  class EngagementsConfigMicrofrontend extends Microfrontend {
    render(appRoot: HTMLElement, history: any) {
      ReactDOM.render(
        <React.StrictMode>
          <ThemeProvider>
            <UserPrivilegesProvider>
              <EngagementsConfigApp
                history={history}
              />
            </UserPrivilegesProvider>
          </ThemeProvider>
        </React.StrictMode>,
        appRoot,
      );
    }

    unmount = (appRoot: HTMLElement) => {
      ReactDOM.unmountComponentAtNode(appRoot);
    };
  });
