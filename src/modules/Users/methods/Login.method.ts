import ControllerMethod from '@classes/ControllerMethod.class'
import TokenService from '@services/Token.service'
import UserModel from '@modules/Users/User.schema'
import { ModuleResponse, Credentials } from '@interfaces'
import { validateOrReject, IsString, IsEmail } from 'class-validator'
import UserInterface from '../User.interface'

class InputValidation {
  @IsString()
  public password: string

  @IsEmail()
  public email: string
}

class Login extends ControllerMethod {
  private user: UserInterface
  private credentials: Credentials

  public handle = async (credentials: Credentials): Promise<ModuleResponse> => {
    this.credentials = credentials

    return this
      .validateInput()
      .then(this.findUser)
      .then(this.verifyPassword)
      .then(this.generateToken)
      .then(this.respond)
  }

  private verifyPassword = async (): Promise<void> => {
    const match = await this.Auth
      .comparePassword(this.credentials.password, this.user.password)

    if (!match) {
      throw new this.HttpException(400, 'invalid credentials')
    }
  }

  private findUser = async (): Promise<void> => {
    const user = await UserModel.findOne({ email: this.credentials.email })

    if (!user) {
      throw new this.HttpException(400, 'user does\'t exists')
    }

    this.user = user
  }

  private validateInput = async (): Promise<void> => {
    try {
      const validation = new InputValidation()
      validation.email = this.credentials.email
      validation.password = this.credentials.password
      await validateOrReject(validation)
    } catch (error) {
      throw new this.HttpException(400, 'invalid inputs')
    }
  }

  private generateToken = (): void => {
    const token = TokenService.encode(this.user)
    this.data = { token }
    this.status = 200
  }
}

export default new Login()