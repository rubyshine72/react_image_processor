import Head from "next/head";
import ImageCompressor from "../components/ImageCompressor";

export default function Home() {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>React Image Compressor</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="A Simple Offline Image Compressor Built With React"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <ImageCompressor />
    </>
  );
}
