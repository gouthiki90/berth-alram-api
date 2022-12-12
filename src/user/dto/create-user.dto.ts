export class CreateUserDto {
  id?: number;
  oid?: string;
  userId: string;
  userName?: string;
  password: any;
  bizName?: string;
  contact?: string;
  managerTel?: string;
  managerName?: string;
}
