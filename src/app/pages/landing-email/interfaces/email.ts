import { EmailType } from "../enums/email-type";

export interface Email {
    id: number,
    sender: string,
    receiver: string,
    object: string,
    body: string,
    emailType: EmailType
}
