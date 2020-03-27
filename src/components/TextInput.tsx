import * as React from "react";

interface ITextInputProps {
  multiline?: boolean;
  rows?: number;
  className?: string;
  value: string;
  name?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const TextInput: React.FC<ITextInputProps> = ({
  className,
  value,
  name,
  placeholder,
  onChange,
  multiline = false,
  rows = 3
}) => {
  return (
    <fieldset className="form-group">
      {multiline ? (
        <textarea
          className={"form-control " + className ?? ""}
          placeholder={placeholder}
          value={value}
          name={name}
          rows={rows}
          onChange={onChange}
        />
      ) : (
        <input
          className={"form-control " + className ?? ""}
          type="text"
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={onChange}
        />
      )}
    </fieldset>
  );
};

export default TextInput;
