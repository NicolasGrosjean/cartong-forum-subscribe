import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Next.js Starter!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="S'inscrire au forum de CartONG" />
        <input type="text" placeholder="Saisir votre email ici" />
        <button onClick={async () => {
          const email = document.querySelector('input').value;
          const response = await fetch(`/.netlify/functions/subscribe?email=${email}`);
          if (response.ok) {
            alert('Inscription réussie, un email de confirmation vous a été envoyé.');
          } else {
            alert('Echec de l\'inscription, veuillez envoyer un email aux administrateurs du forum.');
          }
        }}>S'inscrire</button>
      </main>

      <Footer />
    </div>
  )
}
