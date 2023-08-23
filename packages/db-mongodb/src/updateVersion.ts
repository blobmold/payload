import type { UpdateVersion } from 'payload/dist/database/types';
import type { PayloadRequest } from 'payload/dist/express/types';
import type { MongooseAdapter } from '.';
import { withSession } from './withSession';

export const updateVersion: UpdateVersion = async function updateVersion(
  this: MongooseAdapter,
  { collectionSlug, where, locale, versionData, req = {} as PayloadRequest },
) {
  const VersionModel = this.versions[collectionSlug];
  const options = {
    ...withSession(this, req.transactionID),
    new: true,
    lean: true,
  };

  const query = await VersionModel.buildQuery({
    payload: this.payload,
    locale,
    where,
  });

  const doc = await VersionModel.findOneAndUpdate(query, versionData, options);

  const result = JSON.parse(JSON.stringify(doc));

  const verificationToken = doc._verificationToken;

  // custom id type reset
  result.id = result._id;
  if (verificationToken) {
    result._verificationToken = verificationToken;
  }
  return result;
};