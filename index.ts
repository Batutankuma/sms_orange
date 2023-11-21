import { ShortMessageService } from "./orange";
const sms = new ShortMessageService("******","+243******");
sms.sendSms("+243*****","Salut Comment tu vas?");