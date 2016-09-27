const jsforce = require('jsforce');

const conn = new jsforce.Connection({
  loginUrl: 'https://login.salesforce.com/',
  instanceUrl: 'https://eu11.salesforce.com/',
});
    // Replace with your own login email + password+key
conn.login('ben@cirruskb.com', 'password4046xVHRFnb5TlRN7fNKr6Cu4pH', (err, userInfo) => {
  if (err) { return console.log(err); }
        // Now you can get the access token and instance URL information.
        // Save them to establish connection next time.
  console.log(conn.accessToken);
  console.log(conn.instanceUrl);
        // logged in user property
  console.log(`User ID: ${userInfo.id}`);
  console.log(`Org ID: ${userInfo.organizationId}`);
        // .
  return userInfo;
});


module.exports = conn;
