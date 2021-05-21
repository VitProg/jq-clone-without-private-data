import { IUser } from '../forum.base.interfaces'
import { User } from '../models/user'


export const createUserModel = (userData?: IUser): User | undefined => {
  if (!userData) {
    return undefined
  }
  // noinspection TypeScriptValidateJSTypes
  return Object.assign((new User), userData)
}
