import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJAPNalRviWrzOMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1pODJ0N2k2bi51cy5hdXRoMC5jb20wHhcNMjAwNjEzMDY0MTQ4WhcN
MzQwMjIwMDY0MTQ4WjAkMSIwIAYDVQQDExlkZXYtaTgydDdpNm4udXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3zZGzqCpJ4wRCAvz
6IEBAGUDnRqPgYAswx17XPgskOpp2301XgR1SPLXsS9+v/rwTsqBmU49NiJZvvLw
xwqh7EtERtp5qYxexGU/8DRWY6BwT4hopAj5H3dyNcnOVGWD42z1gFNMzuZlYETT
ZVqpgTCxyiFK0Nlae/QebrRPKU2UMhtGrnoCmvqI6YTrfdMWlz1AvHiEFo2yOEkS
klxU167B7vkk9s3MatZCaXc47kEfB8EjMsxZ9HZwzm10vBlcZGn1NpxJl/qIG15H
/+LWknxvumEMK+1bwnxHDdbNYJBJ4K5Ie2BFIwWdHRjvdE2Gc3UClH60Hsw4MgjV
b1z64wIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTTTeTThqG8
678t9YM4hgc7tPcqizAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AADHpbopMIeQGmoQ7zK/Izk2lhUcRjix4BQVDSM8U0o/h3XN4HY6f0yLgKFqza30
01JFg56w2krs3gDyqpB4QdeJeneiDGLYCufJVDXcgg2FyMg0TobNb2oO38GgEKoO
kFIvlu7W9823zdF9Yepf9LNp6xvP6msEGvy2OgStNzMUPMT2rZXjT7eIutUZN5uF
7wslzWPWNIaTlDO78nS13csCyvECASs9bBR2dHH3R9+z0yssu3PQM8dK9YsqLeeU
6d7ei+bj+Cv+DN1lsmTPZmSVJgNeWt/NPSTT36ix2ppmz/7bUTtMUAvvrnMN/s4Z
1C+i5ZJfd/TCkSGqwP+hQTM=
-----END CERTIFICATE-----
`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  console.log(jwt, Axios, verify, jwt)

  return verify(token, cert,  { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
