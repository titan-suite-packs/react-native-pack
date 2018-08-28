import React, { Component } from 'react';
import Main from './components/Main';
import { Web3Loader, Web3Injector } from './containers/Web3';

export default class App extends Component {
  render() {
    return (
      <Web3Loader>
        {/* You can use the Web3Injector component anywhere down the component tree to pull in the web3 instance */}
        <Web3Injector>
          {web3 => {
            // Only load the Main component when web3 is ready
            return web3 ? <Main web3={web3} /> : null;
          }}
        </Web3Injector>
      </Web3Loader>
    );
  }
}
