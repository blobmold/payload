import { Config as GeneratedTypes } from 'payload/generated-types';
import { APIError } from '../../../errors';
import { Payload } from '../../../payload';
import verifyEmail from '../verifyEmail';
import { PayloadRequest } from '../../../express/types';

export type Options<T extends keyof GeneratedTypes['collections']> = {
  token: string,
  collection: T
}

async function localVerifyEmail<T extends keyof GeneratedTypes['collections']>(
  payload: Payload,
  options: Options<T>,
): Promise<boolean> {
  const {
    collection: collectionSlug,
    token,
  } = options;

  const req = {
    payload,
  } as PayloadRequest;

  const collection = payload.collections[collectionSlug];

  if (!collection) {
    throw new APIError(`The collection with slug ${String(collectionSlug)} can't be found.`);
  }

  return verifyEmail({
    req,
    token,
    collection,
  });
}

export default localVerifyEmail;
