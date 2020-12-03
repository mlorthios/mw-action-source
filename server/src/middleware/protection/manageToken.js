import jwt from 'jsonwebtoken';
import Cryptr from 'cryptr';

export default class ManageToken
{
    createToken(data) {
        const generate = jwt.sign({data}, __config.jwt.secret);

        return generate;
    }

    decodeToken(token) {
        var decoded = jwt.verify(token, __config.jwt.secret);

        return decoded;
    }

    verifyToken(token) {
        try {

            var decoded = jwt.verify(token, __config.jwt.secret);
            return decoded;

          } catch(err) {

            return 'error';

          }
    }

    cryptToken(token) {
        const encrypt = new Cryptr(__config.encrypt.secret);

        return encrypt.encrypt(token);
    }

    decryptToken(crypted) {
        try {
            const decrypt = new Cryptr(__config.encrypt.secret);

            return decrypt.decrypt(crypted);
        } catch(err) {
            return 'error';
        }
    }

    generateEncode(data) {
        const token = this.createToken(data);
        const encrypt_token = this.cryptToken(token);

        return encrypt_token;
    }

    generateDecode(token) {
        const to = this.decryptToken(token);
        const t = this.decodeToken(to);

        return t;
    }
}
