import * as cryptoNode from 'crypto';

export function hashPassword(password: string): string {
  return cryptoNode.createHash('sha256').update(password).digest('hex');
}

module.exports = { hashPassword }; 