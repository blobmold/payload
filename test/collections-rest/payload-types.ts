/* tslint:disable */
/**
 * This file was automatically generated by Payload CMS.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "posts".
 */
export interface Post {
  id: string;
  title?: string;
  description?: string;
  number?: number;
  multiSelect?: ('option1' | 'option2' | 'option3')[];
  relationField?: string | Relation;
  relationHasManyField?: string[] | Relation[];
  relationMultiRelationTo?:
    | {
        value: string | Relation;
        relationTo: 'relation';
      }
    | {
        value: string | Dummy;
        relationTo: 'dummy';
      };
  relationMultiRelationToHasMany?:
    | (
        | {
            value: string;
            relationTo: 'relation';
          }
        | {
            value: string;
            relationTo: 'dummy';
          }
      )[]
    | (
        | {
            value: Relation;
            relationTo: 'relation';
          }
        | {
            value: Dummy;
            relationTo: 'dummy';
          }
      )[];
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "relation".
 */
export interface Relation {
  id: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "dummy".
 */
export interface Dummy {
  id: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "point".
 */
export interface Point {
  id: string;
  /**
   * @minItems 2
   * @maxItems 2
   */
  point?: [number, number];
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "custom-id".
 */
export interface CustomId {
  id: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "custom-id-number".
 */
export interface CustomIdNumber {
  id: number;
  name?: string;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  email?: string;
  resetPasswordToken?: string;
  resetPasswordExpiration?: string;
  loginAttempts?: number;
  lockUntil?: string;
  createdAt: string;
  updatedAt: string;
}
