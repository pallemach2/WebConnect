import { User } from '@prisma/client';

interface Context {
  user?: User;
  token?: string;
}

export default Context;
