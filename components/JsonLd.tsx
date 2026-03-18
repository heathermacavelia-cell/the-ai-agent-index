"use client";

import Head from "next/head";

type Props = {
  json: Record<string, unknown>;
};

export function JsonLd({ json }: Props) {
  return (
    <Head>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
      />
    </Head>
  );
}

