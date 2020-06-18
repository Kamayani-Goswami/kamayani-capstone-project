// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'w8pm96imde'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
   domain: 'dev-i82t7i6n.us.auth0.com',            // Auth0 domain
   clientId: 'mcd8IB5gaXsYkRJ6Sq91Srwaj3rIj6lR',          // Auth0 client id
   callbackUrl: 'http://localhost:3000/callback/'
}