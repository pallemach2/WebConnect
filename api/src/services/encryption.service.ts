import { randomBytes, scryptSync } from 'crypto';

class EncryptionService {
  static encrypt = (value: string, salt: string) => {
    return scryptSync(value, salt, 32).toString('hex');
  };

  static hash = (value: string): string => {
    const salt = randomBytes(16).toString('hex');
    return this.encrypt(value, salt) + salt;
  };

  static match = (value: string, hash: string): Boolean => {
    const salt = hash.slice(64);
    const valueHash = hash.slice(0, 64);
    const inputValueHash = this.encrypt(value, salt);

    return inputValueHash === valueHash;
  };
}

export default EncryptionService;
