import Head from "next/head";
import React, { ReactNode } from "react";

type PageHeadProps = {
  children: ReactNode;
};

export default function PageHead({ children }: PageHeadProps) {
  return (
    <Head>
      {children}
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
