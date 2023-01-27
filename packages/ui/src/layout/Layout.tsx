import Head from 'next/head';

export default function Layout(props: { title?: string; children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>{props.title ? `Event List | ${props.title}` : 'Event List'}</title>
        <link href="https://fonts.cdnfonts.com/css/sifonn" rel="stylesheet" />
      </Head>
      {props.children}
    </>
  );
}
