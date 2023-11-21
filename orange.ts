import * as https from 'https';
import * as request from 'request';

export class ShortMessageService {
    private _token: string;
    private _phoneNumber: string;

    /**
     * 
     * @param token : votre clé qui commence par {Basic ****************}
     * @param phoneNumber : le bumero que vous avez utiliser pour activé votre compte ORANGE SMS API
     */
    constructor(token: string, phoneNumber: string) {
        this._token = token;
        this._phoneNumber = phoneNumber;
    }

    // Méthode publique pour envoyer un SMS
    /**
     * 
     * @param destinateur :vous devez mettre le numero de la personne que vous voulez envoyer le SMS 
     * sous le format: {+243 812167999}
     * @param message : vous devez mettre le message 
     */
    public sendSms(destinateur: string, message: string) {
        // Configuration de l'authentification
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

        // Effectuer la demande pour obtenir le jeton d'accès
        let req = https.request(options, (response) => {
            response.setEncoding('utf8');
            let responseData = '';
            response.on('data', (data) => {
                responseData += data;
            });
            response.on('end', () => {
                let result = JSON.parse(responseData);
                // Une fois le jeton d'accès obtenu, appeler la méthode privée send pour envoyer le SMS
                this.send(result.access_token, destinateur, message);
            });
        }).on('error', (e) => { });
        req.write(postData);
        req.end();
    }

    // Méthode privée pour envoyer le SMS une fois le jeton d'accès obtenu
    private send(token: string, destinateur: string, message: string) {
        let receiver = "tel:" + destinateur;
        let sender = `tel:${this._phoneNumber}`;
        let headers = {
            'Authorization': "Bearer " + token,
            'Content-Type': 'application/json'
        };

        // Corps de la requête pour envoyer le SMS
        let body = {
            outboundSMSMessageRequest: {
                address: receiver,
                senderAddress: sender,
                outboundSMSTextMessage: {
                    message: message
                }
            }
        };

        // Options de la requête HTTP pour envoyer le SMS
        let options = {
            uri: `https://api.orange.com/smsmessaging/v1/outbound/tel:${this._phoneNumber}/requests`,
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        };

        // Effectuer la requête pour envoyer le SMS
        request(options, (error: any, response: any) => {
            if (!error && response.statusCode == 201) {
                // Si la requête est réussie, afficher le code de statut
                console.log(response.statusCode);
            } else {
                // En cas d'erreur, afficher l'erreur
                console.log(error);
            }
        });
    }
}