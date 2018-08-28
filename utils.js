// Originally written for Titan react-pack
export function unlock(w3, addr, pw) {
  return new Promise((resolve, reject) => {
    w3.personal.unlockAccount(addr, pw, 999999, (err, unlock) => {
      if (err) reject(err);
      else if (unlock && unlock === true) {
        resolve(addr);
      } else {
        // Return as an object to match our error structure elsewhere
        reject({ message: 'unlock fail' });
      }
    });
  });
}

export const wait = ms => {
  return new Promise((resolve, reject) => {
    // If an invalid argument is passed, reject the promise
    // If nothing is passed, resolve the promise immediately
    if (typeof ms !== 'number' && ms !== undefined) {
      reject(new Error('ms must be a number'));
    }
    // Wrap the call to resolve in a function so we can pass it a value
    setTimeout(() => resolve(ms), ms);
  });
};

export function pollForTransactionReceipt(w3, hashString) {
  return new Promise((resolve, reject) => {
    function checkForReceipt() {
      console.log('Checking if transaction has been mined...');
      w3.eth.getTransactionReceipt(hashString, (err, res) => {
        if (err) {
          reject(err);
        } else {
          if (res === null) {
            // Wait, then
            return (
              wait(5000)
                // Then, check again
                .then(() => checkForReceipt())
            );
          }
          resolve(res);
        }
      });
    }
    // Start checking if the transaction has been mined
    checkForReceipt();
  });
}
