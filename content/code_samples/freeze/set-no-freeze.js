const {CasinocoinAPI} = require('casinocoin-libjs');

const api = new CasinocoinAPI({
  server: 'wss://ws01.casinocoin.org', // Public rippled server
  port: 4443
});
api.on('error', (errorCode, errorMessage) => {
  console.log(errorCode + ': ' + errorMessage);
});

const issuing_address = 'caddErVDoBGw1oWMxMHyGhSs9gfTn5pWet';
const issuing_secret = 'snnDVkSW3aV6jvMJTPdCiE2Qxv1RW';
    // Best practice: get your secret from an encrypted
    //  config file instead

api.connect().then(() => {

  // Prepare a settings transaction to enable no freeze
  const settings = {
    'noFreeze': true
  };

  console.log('preparing settings transaction for account:',
              issuing_address);
  return api.prepareSettings(issuing_address, settings);

}).then(prepared_tx => {

  // Sign and submit the settings transaction
  console.log('signing tx:', prepared_tx.txJSON);
  const signed1 = api.sign(prepared_tx.txJSON, issuing_secret);
  console.log('submitting tx:', signed1.id);

  return api.submit(signed1.signedTransaction);
}).then(() => {
  return api.disconnect();
}).catch(console.error);
