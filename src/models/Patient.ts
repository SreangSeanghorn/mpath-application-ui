export class Patient {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;

  constructor(
    id: number,
    name: string,
    email: string,
    phoneNumber: string,
    address: string,
    dateOfBirth: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.dateOfBirth = dateOfBirth;
  }

    getAge() {
        const today = new Date();
        const dob = new Date(this.dateOfBirth);
        let age = today.getFullYear() - dob.getFullYear();
        const month = today.getMonth() - dob.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
        age--;
        }
        return age;
    }
}
