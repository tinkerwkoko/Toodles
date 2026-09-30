import { useEffect, useState } from 'react';
import type { AccentColor } from '../../types';
import { ACCENT_KEYS, ACCENT_LABELS, accent } from '../../lib/color';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Field, Input } from '../ui/Field';
import { cx } from '../../lib/cx';

export interface ColumnDialogValues {
  name: string;
  color: AccentColor;
}

export interface ColumnDialogProps {
  open: boolean;
  title: string;
  initialName: string;
  initialColor: AccentColor;
  submitLabel: string;
  onSave: (values: ColumnDialogValues) => void;
  onClose: () => void;
}

/** One small dialog for both "add column" and "rename / recolour column". */
export function ColumnDialog({
  open,
  title,
  initialName,
  initialColor,
  submitLabel,
  onSave,
  onClose,
}: ColumnDialogProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState<AccentColor>(initialColor);

  // Reset the fields each time the dialog is opened.
  useEffect(() => {
    if (!open) return;
    setName(initialName);
    setColor(initialColor);
  }, [open, initialName, initialColor]);

  const canSubmit = name.trim().length > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Never mind
          </Button>
          <Button disabled={!canSubmit} onClick={() => onSave({ name: name.trim(), color })}>
            {submitLabel}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Column name" htmlFor="column-name">
          <Input
            id="column-name"
            data-autofocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Waiting on someone"
          />
        </Field>

        <fieldset className="space-y-2">
          <legend className="text-sm font-bold text-lilac-700">Column colour</legend>
          <div className="flex flex-wrap gap-2">
            {ACCENT_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                aria-label={ACCENT_LABELS[key]}
                aria-pressed={color === key}
                onClick={() => setColor(key)}
                className={cx(
                  'h-10 w-10 rounded-full border-2 transition',
                  accent(key).mid,
                  color === key ? 'scale-105 border-lilac-700' : 'border-transparent hover:scale-105',
                )}
              />
            ))}
          </div>
        </fieldset>
      </div>
    </Dialog>
  );
}
