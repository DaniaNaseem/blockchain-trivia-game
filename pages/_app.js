import '@/styles/globals.css'
import { MeshProvider } from "@martifylabs/mesh-react";
import Head from "next/head";


export default function App({ Component, pageProps }) {
  

  return (
		<>
		<MeshProvider>
			<Head>
				{/* common title */}
				<title>Quizzy Pop - A P2E Quiz Game!</title>
			</Head>
      <Component {...pageProps} />
      </MeshProvider>
      </>
  )
}
