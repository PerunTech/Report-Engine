/**
 * Maps a Svarog FIELD_TYPE to the modifier class that colours its badge,
 * so the rail and the criteria table stay in sync.
 */
export const typeBadgeClass = (fieldType) => {
  switch ((fieldType || '').toUpperCase()) {
    case 'NUMERIC':
      return 're-type-badge--numeric'
    case 'NVARCHAR':
    case 'TEXT':
      return 're-type-badge--text'
    case 'DATE':
    case 'DATETIME':
    case 'TIMESTAMP':
      return 're-type-badge--date'
    case 'BOOLEAN':
    case 'BOOL':
      return 're-type-badge--bool'
    default:
      return 're-type-badge--other'
  }
}
