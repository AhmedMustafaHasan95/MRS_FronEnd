import { ErrorDTO } from "./error-dto";

export class ErrorResponse {
    message:string;
    code:string;
    validationErrors:ErrorDTO[]=[];

}