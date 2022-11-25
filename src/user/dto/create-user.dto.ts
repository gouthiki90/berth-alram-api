export class CreateUserDto {
  id?: number;
  oid?: string;
  userId: string;
  password: any;
  bizName?: string;
  contact?: string;
  managerTel?: string;
  managerName?: string;
}
