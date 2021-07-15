import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AwsCognitoConfig } from '../aws/aws-cognito.config';
import { passportJwtSecret } from 'jwks-rsa';
import { Logger, Injectable } from '@nestjs/common';
/*
Passport verifica la firma del jwt y
decodifica el json luego acciona el metodo validate para validar el json decodificado
de nuestro token
*/
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger(JwtStrategy.name);

  constructor(private authConfig: AwsCognitoConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      audience: authConfig.clientId,
      // indica que el amazon cognito es el emisor del token
      issuer: authConfig.authority,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        // limita las llamadas que se haran al endpoint de jwks
        jwksRequestsPerMinute: 5,
        jwksUri: `${authConfig.authority}/.well-known/jwks.json`,
      }),
    });
  }
  // recibe el json decodificado
  public async validate(payload: any) {
    this.logger.log(`payload: ${JSON.stringify(payload)}`);

    return { idUsuario: payload.sub, email: payload.email };
  }
}
