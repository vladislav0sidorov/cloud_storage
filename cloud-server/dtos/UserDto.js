export default class UserDto {
  email;
  id;
  isActivated;
  avatar;
  gender;
  firstName;
  lastName;
  patronymic;
  dateOfBirth;
  locality;
  phone;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.avatar = model.avatar;
    this.gender = model.gender;
    this.firstName = model.firstName;
    this.lastName = model.lastName;
    this.patronymic = model.patronymic;
    this.dateOfBirth = model.dateOfBirth;
    this.locality = model.locality;
    this.phone = model.phone;
  }
}
