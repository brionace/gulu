import { Box } from "@chakra-ui/react";
import { ReactNode, useEffect, useRef, useState, useLayoutEffect } from "react";
import { Noop } from "react-hook-form";

interface LabelProps {
  label: string;
}

export function Label({ label }: LabelProps) {
  return (
    <Box
      as={"h2"}
      mb={2}
      // css={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
    >
      {label}
    </Box>
  );
}

interface InputWrapperProps {
  children: ReactNode;
}

export function InputWrapper({ children }: InputWrapperProps) {
  return (
    <Box px={4} pt={4} pb={2}>
      {children}
    </Box>
  );
}

interface InputProps {
  placeholder: string;
  //   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (e: string) => void;
  onBlur?: Noop;
  value?: string;
  children?: ReactNode;
  minHeight?: string;
}

export function Input({
  placeholder,
  onChange,
  onBlur,
  value,
  children,
  minHeight,
}: InputProps) {
  const [offset, setOffset] = useState<number | undefined>();
  const inputEl = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (offset === undefined || !offset || inputEl.current === null) {
      return;
    }
    const newRange = document.createRange();
    newRange.setStart(inputEl.current.childNodes[0], offset);

    const selection = document.getSelection();

    selection?.removeAllRanges();
    selection?.addRange(newRange);
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const range = document.getSelection()?.getRangeAt(0);

    if (range) {
      setOffset(range.startOffset);
    }

    if (e.currentTarget.textContent) {
      onChange(e.currentTarget.textContent);
    }
  };

  return (
    <Box
      ref={inputEl}
      contentEditable={true}
      suppressContentEditableWarning={true}
      placeholder={placeholder}
      onInput={handleOnChange}
      dangerouslySetInnerHTML={{ __html: value ? value : "" }}
      minH={minHeight}
    />
  );
}
