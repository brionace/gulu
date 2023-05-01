import { Grid } from "@chakra-ui/react";
import React, { ReactNode } from "react";

type PageLayoutProps = {
  gridTemplateRows?: string;
  gridAutoRows?: string;
  alignContent?: string;
  templateAreas?: string;
  textColor?: string;
  children: ReactNode;
  padding?: number;
  margin?: number;
};

export default function PageLayout({
  gridTemplateRows,
  gridAutoRows,
  alignContent,
  templateAreas,
  textColor,
  children,
  padding,
  margin,
}: PageLayoutProps) {
  const templateRows = gridTemplateRows ?? "50px 1fr";
  const autoRows = gridAutoRows ?? "auto";
  const content = alignContent ?? "space-between";
  const areas = templateAreas ?? "";
  const p = padding ?? "";
  const m = margin ?? "";
  return (
    <Grid
      gap={4}
      height="100vh"
      alignContent={content}
      color={textColor}
      gridAutoRows={autoRows}
      gridTemplateRows={templateRows}
      templateAreas={areas}
      p={p}
      m={m}
    >
      {children}
    </Grid>
  );
}
