import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import { abi, deployed_address } from '../build/bolts/SimpleStorage.json';
import { defaultAccount, password } from '../titanrc';
import { unlock, pollForTransactionReceipt } from '../utils';

export default class Main extends React.Component {
  state = {
    storedValue: '0',
    inputValue: '',
    msg: '',
    err: '',
    isSubmitting: false,
  };

  componentDidMount() {
    this.getValue()
      .then(res => {
        this.updateValueDisplayed(res);
      })
      .catch(err => {
        this.setState({
          err: err.message,
        });
      });
  }

  getValue = () => {
    const { web3 } = this.props;
    // Get the stored value from contract
    const simpleStorageContract = web3.eth.contract(abi).at(deployed_address);
    return new Promise((resolve, reject) => {
      simpleStorageContract.get((err, value) => {
        if (err) {
          reject(err);
        } else {
          // Convert the BigNumber returned from the smart contract
          resolve(String(value));
        }
      });
    });
  };

  handleInputChange = inputValue => {
    // If the user input is not a number, store 0
    // Else, store the input as a number
    let newValue;
    if (Number(inputValue)) {
      newValue = inputValue.trim();
    } else {
      newValue = '';
    }
    this.setState({
      inputValue: newValue,
    });
  };

  handleSubmit = () => {
    const { web3 } = this.props;
    this.setState({
      isSubmitting: true,
      err: '',
      msg: 'Submitting...',
    });
    unlock(web3, defaultAccount, password)
      .then(unlockedAddress => {
        return this.setValue(unlockedAddress);
      })
      .then(transactionHash => {
        this.setState({
          msg: `Transaction submitted with hash: ${transactionHash}. \n\nWaiting for transaction to be mined... \nThis may take a minute.`,
        });
        return pollForTransactionReceipt(web3, transactionHash);
      })
      .then(transactionObject => {
        const { status } = transactionObject;
        if (status === '0x0') {
          throw new Error('Transaction failed.');
        }
        return this.getValue();
      })
      .then(retrievedValue => {
        this.updateValueDisplayed(retrievedValue);
      })
      .catch(err => {
        this.setState({
          err: err.message,
          msg: '',
        });
      })
      .then(() => {
        this.setState({
          isSubmitting: false,
        });
      });
  };

  setValue = fromAddress => {
    const { web3 } = this.props;
    const simpleStorageContract = web3.eth.contract(abi).at(deployed_address);
    return new Promise((resolve, reject) => {
      simpleStorageContract.set(
        Number(this.state.inputValue),
        { from: fromAddress },
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(web3.toHex(res));
          }
        }
      );
    });
  };

  updateValueDisplayed = newValue => {
    this.setState({
      storedValue: newValue,
      inputValue: '',
      msg: '',
    });
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <View style={styles.main}>
          <Text style={styles.appName}>Titan React Native Pack</Text>
          <Text style={styles.defaultText}>
            Your Titan Pack is installed and ready.
          </Text>
          <Text style={styles.heading}>Smart Contract Example</Text>
          <Text style={styles.defaultText}>
            The stored value is: {this.state.storedValue}
          </Text>
          <TextInput
            style={
              this.state.isSubmitting ? styles.inputSubmitting : styles.input
            }
            underlineColorAndroid="transparent"
            onChangeText={this.handleInputChange}
            onSubmitEditing={this.handleSubmit}
            value={this.state.inputValue.toString()}
            editable={!this.state.isSubmitting}
            placeholder="Enter a new value"
          />
          <Text style={styles.debugMsg}>
            {this.state.err || this.state.msg}
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with 🔥 by Northern Block in 🇨🇦
          </Text>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    marginTop: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  defaultText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  debugMsg: {
    color: 'rebeccapurple',
    fontSize: 14,
    marginHorizontal: 16,
    marginTop: 32,
    textAlign: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderColor: 'rgba(34, 36, 38, 0.15)',
    borderRadius: 4,
    borderWidth: 1,
    fontSize: 16,
    padding: 11,
    textAlign: 'center',
    backgroundColor: 'white',
    color: 'black',
  },
  inputSubmitting: {
    borderColor: 'rgba(34, 36, 38, 0.15)',
    borderRadius: 4,
    borderWidth: 1,
    fontSize: 16,
    padding: 11,
    textAlign: 'center',
    backgroundColor: 'lightgrey',
    color: 'grey',
  },
  logo: {
    width: 75,
    height: 75,
    margin: 16,
    alignSelf: 'flex-start',
  },
  main: {
    paddingHorizontal: 40,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  footer: {
    alignSelf: 'stretch',
    borderTopWidth: 1,
    borderColor: 'rgba(34, 36, 38, 0.15)',
    marginHorizontal: 16,
  },
  footerText: {
    fontSize: 12,
    marginVertical: 6,
    textAlign: 'center',
  },
});
