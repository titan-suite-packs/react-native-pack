import React, { Component } from 'react';
import Web3 from 'aion-web3';
import { host, port } from '../titanrc';

// Create a React context with provider and consumer components
// The value (web3) initializes as undefined
const {
  Provider: ContextProvider,
  Consumer: Web3Injector,
} = React.createContext(undefined);

class Web3Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3Instance: undefined,
    };
  }

  componentDidMount() {
    const provider = new Web3.providers.HttpProvider(`${host}:${port}`);
    const web3Instance = new Web3(provider);
    this.setState({
      web3Instance,
    });
  }

  render() {
    return (
      <ContextProvider value={this.state.web3Instance}>
        {this.props.children}
      </ContextProvider>
    );
  }
}

// Export a Web3 object - Use the loader or inject like this: Web3.Loader
export default {
  Loader: Web3Loader,
  Injector: Web3Injector,
};

// Export loader and injector separately
export { Web3Loader, Web3Injector };
