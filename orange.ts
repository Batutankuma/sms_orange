import axios from 'axios';

export class ShortMessageService {
    private clientId: string;
    //client token
    private clientSecret: string;
    //Le numéro Orange que vous avez configuré pour l'envoi de SMS
    private phoneNumber: string;

    /**
     * 
     * @param _clientId 
     * @param _clientSecret 
     * @param _phoneNumber 
     */
    constructor(_clientId: string, _clientSecret: string, _phoneNumber: string) {
        this.clientId = _clientId;
        this.clientSecret = _clientSecret;
        this.phoneNumber = _phoneNumber;
    }

    /**
     * Recuperation de token generer
     * @returns token
     */
    private async getToken() {
        try {
            const response = await axios.post('https://api.orange.com/oauth/v3/token', null, {
                params: {
                    grant_type: 'client_credentials',
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                },
            });
            return response.data.access_token;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * 
     * @param phoneDestinateur : Ajout de numéro de destinateur {+243976729561}
     * @param message 
     */
    public async sendSMS(phoneDestinateur: string, message:string){
        try {
            let accessToken = await this.getToken();
            const response = await axios.post(
                'https://api.orange.com/smsmessaging/v1/outbound/tel:' + this.phoneNumber + '/requests',
                {
                    outboundSMSMessageRequest: {
                        address: 'tel:' + phoneDestinateur,
                        senderAddress: 'tel:' + this.phoneNumber,
                        senderName: 'VotreNom',
                        outboundSMSTextMessage: {
                            message: message,
                        },
                    },
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + accessToken,
                        'Content-Type': 'application/json',
                    },
                }
            );
        
            console.log('SMS envoyé avec succès:', response.data);
        } catch (error) {
            console.log(error);
        }
    }
}


