import React from 'react'
import { useTranslation } from 'react-i18next'

import type { Props } from './types.js'

import { getTranslation } from '../../../../../utilities/getTranslation.js'
import { useCollapsible } from '../../../elements/Collapsible/provider.js'
import { ErrorPill } from '../../../elements/ErrorPill/index.js'
import FieldDescription from '../../FieldDescription/index.js'
import { useFormSubmitted } from '../../Form/context.js'
import { createNestedFieldPath } from '../../Form/createNestedFieldPath.js'
import RenderFields from '../../RenderFields/index.js'
import { WatchChildErrors } from '../../WatchChildErrors/index.js'
import withCondition from '../../withCondition/index.js'
import { useRow } from '../Row/provider.js'
import { useTabs } from '../Tabs/provider.js'
import './index.scss'
import { GroupProvider, useGroup } from './provider.js'

const baseClass = 'group-field'

const Group: React.FC<Props> = (props) => {
  const {
    admin: { className, description, hideGutter = false, readOnly, style, width },
    fieldTypes,
    fields,
    indexPath,
    label,
    name,
    path: pathFromProps,
    permissions,
  } = props

  const isWithinCollapsible = useCollapsible()
  const isWithinGroup = useGroup()
  const isWithinRow = useRow()
  const isWithinTab = useTabs()
  const { i18n } = useTranslation()
  const submitted = useFormSubmitted()
  const [errorCount, setErrorCount] = React.useState(undefined)
  const groupHasErrors = submitted && errorCount > 0

  const path = pathFromProps || name

  return (
    <div
      className={[
        'field-type',
        baseClass,
        isWithinCollapsible && `${baseClass}--within-collapsible`,
        isWithinGroup && `${baseClass}--within-group`,
        isWithinRow && `${baseClass}--within-row`,
        isWithinTab && `${baseClass}--within-tab`,
        !hideGutter && isWithinGroup && `${baseClass}--gutter`,
        groupHasErrors && `${baseClass}--has-error`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        ...style,
        width,
      }}
      id={`field-${path.replace(/\./g, '__')}`}
    >
      <WatchChildErrors fieldSchema={fields} path={path} setErrorCount={setErrorCount} />
      <GroupProvider>
        <div className={`${baseClass}__wrap`}>
          <div className={`${baseClass}__header`}>
            {(label || description) && (
              <header>
                {label && <h3 className={`${baseClass}__title`}>{getTranslation(label, i18n)}</h3>}
                <FieldDescription
                  className={`field-description-${path.replace(/\./g, '__')}`}
                  description={description}
                  value={null}
                />
              </header>
            )}
            {groupHasErrors && <ErrorPill count={errorCount} withMessage />}
          </div>
          <RenderFields
            fieldSchema={fields.map((subField) => ({
              ...subField,
              path: createNestedFieldPath(path, subField),
            }))}
            fieldTypes={fieldTypes}
            indexPath={indexPath}
            permissions={permissions?.fields}
            readOnly={readOnly}
          />
        </div>
      </GroupProvider>
    </div>
  )
}

export default withCondition(Group)