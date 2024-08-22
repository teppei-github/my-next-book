import '../app/globals.css';
import { RecoilRoot } from 'recoil';
import ReturnTopButton from '@/components/ReturnTopButton';

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
      <ReturnTopButton /> {/* クライアントサイド専用のボタン */}
    </RecoilRoot>
  );
}

export default MyApp;