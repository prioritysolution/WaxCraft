"use client";

import { Button, ButtonProps, Spinner } from "@heroui/react";
import { ReactNode } from "react";
import { formSubmitButtonClassName, primaryButtonClassName } from "@/lib/uiStyles";
import { ModalActionIcon } from "@/lib/modalActionIcons";
import { cn } from "@/lib/utils";

function labelFromChildren(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(labelFromChildren).join("").trim();
  }
  return "";
}

export function FormSubmitButton({
  children,
  startContent,
  className,
  isLoading,
  size = "lg",
  radius = "sm",
  color = "primary",
  type = "submit",
  ...props
}: ButtonProps) {
  const label = labelFromChildren(children);

  return (
    <Button
      type={type}
      color={color}
      size={size}
      radius={radius}
      className={cn(formSubmitButtonClassName, primaryButtonClassName, className)}
      isLoading={isLoading}
      spinner={<Spinner size="sm" color="current" />}
      startContent={
        startContent ??
        (isLoading || !label ? null : <ModalActionIcon label={label} />)
      }
      {...props}
    >
      {children}
    </Button>
  );
}
