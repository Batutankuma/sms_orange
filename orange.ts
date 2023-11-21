import * as https from 'https';
import * as request from 'request';

export class ShortMessageService {
    private _token: string;
    private _phoneNumber: string;

    constructor(token: string, phoneNumber: string) {
        this._token = token;
        this._phoneNumber = phoneNumber;
    }

    public sendSms(destinateur: string, message: string) {
        let credentials: string = this._token;
        let postData: string = "grant_type=client_credentials";
        let options: https.RequestOptions = {
            host: 'api.orange.com',
            path: '/oauth/v3/token',
            method: 'POST',
            headers: {
                'Authorization': credentials,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData).toString()
            }
        };
        let req = https.request(options, (response) => {
            response.setEncoding('utf8');
            let responseData = '';
            response.on('data', (data) => {
                responseData += data;
            });
            response.on('end', () => {
                let result = JSON.parse(responseData);
                this.send(result.access_token, destinateur, message);
            });
        }).on('error', (e) => { });
        req.write(postData);
        req.end();
    }

    private send(token: string, destinateur: string, message: string) {
        let receiver = "tel:" + destinateur;
        let sender = `tel:${this._phoneNumber}`;
        let headers = {
            'Authorization': "Bearer " + token,
            'Content-Type': 'application/json'
        };
        let body = {
            outboundSMSMessageRequest: {
                address: receiver,
                senderAddress: sender,
                outboundSMSTextMessage: {
                    message: message
                }
            }
        };


        let options = {
            uri: `https://api.orange.com/smsmessaging/v1/outbound/tel:${this._phoneNumber}/requests`,
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        };

        request(options, (error:any, response:any) => {
            if (!error && response.statusCode == 201) {
                console.log(response.statusCode);
            } else {
                console.log(error);
            }
        });

    }
}

