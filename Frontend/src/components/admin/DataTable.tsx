import { CreditCard as Edit, Trash2 } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
}

export default function DataTable<T extends { id: number }>({
  data,
  columns,
  onEdit,
  onDelete,
  loading = false,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <p className="text-center text-slate-500">Aucune donnée disponible</p>
      </div>
    );
  }

  const hasActions = Boolean(onEdit || onDelete);

  const renderCell = (item: T, column: Column<T>) =>
    column.render ? column.render(item) : String(item[column.key as keyof T] || '-');

  const actionButtons = (item: T) => (
    <>
      {onEdit && (
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Modifier"
          aria-label="Modifier"
        >
          <Edit size={18} />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(item)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Supprimer"
          aria-label="Supprimer"
        >
          <Trash2 size={18} />
        </button>
      )}
    </>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Vue cartes (< 768px) : un tableau à plusieurs colonnes est illisible
          sur un téléphone, chaque ligne devient donc une carte étiquetée. */}
      <ul className="divide-y divide-slate-200 md:hidden">
        {data.map((item) => (
          <li key={item.id} className="p-4 space-y-3">
            <dl className="space-y-2">
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-0.5">
                  <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {column.label}
                  </dt>
                  <dd className="text-sm text-slate-900 break-words">
                    {renderCell(item, column)}
                  </dd>
                </div>
              ))}
            </dl>

            {hasActions && (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                {actionButtons(item)}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Vue tableau (>= 768px), scroll horizontal confiné au conteneur */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              {hasActions && (
                <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-4 lg:px-6 py-4 text-sm text-slate-900">
                    {renderCell(item, column)}
                  </td>
                ))}
                {hasActions && (
                  <td className="px-4 lg:px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {actionButtons(item)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
