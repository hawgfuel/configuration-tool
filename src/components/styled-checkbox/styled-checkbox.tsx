import React from 'react';

export type Selectable<T> = T & { isSelected?: boolean };

export type StyledCheckboxProps = {
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  ariaLabel: string;
  checked?: boolean;
};

// CommonUX requires a wrapping div and label containing a span to properly style checkboxes
// Also override styles for the div and label to avoid bloated table
export const StyledCheckbox: React.FC<StyledCheckboxProps> = (props) => (
  <div className="checkbox" style={{ margin: 0 }}>
    <label style={{ padding: 0 }}>
      <input
        aria-label={props.ariaLabel}
        type="checkbox"
        onChange={props.onChange}
        checked={props.checked}
      />
      <span />
    </label>
  </div>
);
