import type { Response } from 'express'

import jwt from 'jsonwebtoken'

import type { Collection } from '../../collections/config/types.js'
import type { PayloadRequest } from '../../express/types.js'

import { APIError } from '../../errors/index.js'
import getCookieExpiration from '../../utilities/getCookieExpiration.js'
import { initTransaction } from '../../utilities/initTransaction.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { authenticateLocalStrategy } from '../strategies/local/authenticate.js'
import { generatePasswordSaltHash } from '../strategies/local/generatePasswordSaltHash.js'
import { getFieldsToSign } from './getFieldsToSign.js'

export type Result = {
  token?: string
  user: Record<string, unknown>
}

export type Arguments = {
  collection: Collection
  data: {
    password: string
    token: string
  }
  depth?: number
  overrideAccess?: boolean
  req: PayloadRequest
  res?: Response
}

async function resetPassword(args: Arguments): Promise<Result> {
  if (
    !Object.prototype.hasOwnProperty.call(args.data, 'token') ||
    !Object.prototype.hasOwnProperty.call(args.data, 'password')
  ) {
    throw new APIError('Missing required data.')
  }

  const {
    collection: { config: collectionConfig },
    data,
    depth,
    overrideAccess,
    req: {
      payload: { config, secret },
      payload,
    },
    req,
  } = args

  try {
    const shouldCommit = await initTransaction(req)

    // /////////////////////////////////////
    // Reset Password
    // /////////////////////////////////////

    const user = await payload.db.findOne<any>({
      collection: collectionConfig.slug,
      req,
      where: {
        resetPasswordExpiration: { greater_than: Date.now() },
        resetPasswordToken: { equals: data.token },
      },
    })

    if (!user) throw new APIError('Token is either invalid or has expired.')

    // TODO: replace this method
    const { hash, salt } = await generatePasswordSaltHash({ password: data.password })

    user.salt = salt
    user.hash = hash

    user.resetPasswordExpiration = Date.now()

    if (collectionConfig.auth.verify) {
      user._verified = true
    }

    const doc = await payload.db.updateOne({
      collection: collectionConfig.slug,
      data: user,
      id: user.id,
      req,
    })

    await authenticateLocalStrategy({ doc, password: data.password })

    const fieldsToSign = getFieldsToSign({
      collectionConfig,
      email: user.email,
      user,
    })

    const token = jwt.sign(fieldsToSign, secret, {
      expiresIn: collectionConfig.auth.tokenExpiration,
    })

    if (args.res) {
      const cookieOptions = {
        domain: undefined,
        expires: getCookieExpiration(collectionConfig.auth.tokenExpiration),
        httpOnly: true,
        path: '/',
        sameSite: collectionConfig.auth.cookies.sameSite,
        secure: collectionConfig.auth.cookies.secure,
      }

      if (collectionConfig.auth.cookies.domain)
        cookieOptions.domain = collectionConfig.auth.cookies.domain

      args.res.cookie(`${config.cookiePrefix}-token`, token, cookieOptions)
    }

    const fullUser = await payload.findByID({
      collection: collectionConfig.slug,
      depth,
      id: user.id,
      overrideAccess,
      req,
    })
    if (shouldCommit) await payload.db.commitTransaction(req.transactionID)

    return {
      token: collectionConfig.auth.removeTokenFromResponses ? undefined : token,
      user: fullUser,
    }
  } catch (error: unknown) {
    await killTransaction(req)
    throw error
  }
}

export default resetPassword