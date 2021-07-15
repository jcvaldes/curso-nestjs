import { Injectable } from '@nestjs/common';
import { AuthRegistroUsuarioDto } from '../auth/dtos/auth-registro-usuario.dto';
import { AuthLoginUsuarioDto } from '../auth/dtos/auth-login-usuario.dto';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { AwsCognitoConfig } from './aws-cognito.config';

@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;

  constructor(private authConfig: AwsCognitoConfig) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  async registrarUsuario(authRegistroUsuarioDto: AuthRegistroUsuarioDto) {
    const { nombre, email, password, celular } = authRegistroUsuarioDto;

    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        password,
        // Atributos adicionales configurados en cognito user pool
        [
          new CognitoUserAttribute({
            Name: 'phone_number',
            Value: celular,
          }),
          new CognitoUserAttribute({
            Name: 'name',
            Value: nombre,
          }),
        ],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }

  async autenticarUsuario(authLoginUsuarioDto: AuthLoginUsuarioDto) {
    const { email, password } = authLoginUsuarioDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }
}
