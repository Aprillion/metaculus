import React, { FC } from "react";

import Checkbox from "@/components/ui/checkbox";

type Props = {
  choice: string;
  color: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onHighlight: (highlighted: boolean) => void;
};

const ChoiceCheckbox: FC<Props> = ({
  choice,
  checked,
  onChange,
  onHighlight,
  color,
}) => {
  const handleHighlightStart = checked ? () => onHighlight(true) : undefined;
  const handleHighlightEnd = checked ? () => onHighlight(false) : undefined;

  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      onMouseEnter={handleHighlightStart}
      onMouseLeave={handleHighlightEnd}
      onTouchStart={handleHighlightStart}
      onTouchMove={handleHighlightEnd}
      label={choice}
      color={color}
    />
  );
};

export default ChoiceCheckbox;
