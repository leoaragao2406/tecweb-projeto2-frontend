import "./index.css";
import { FaCoins } from 'react-icons/fa';

export default function Header(props) {
  return (
    <div>
      <div className="titulo">
        <FaCoins style={{ marginRight: '8px' }} /> BubuCoinMarket
      </div>
      <div className="subtitulo">
        <p>All Coins</p>
        <p className="prece">Price</p>
        <p className="mkcap">Market Cap</p>
        <p>24h</p>
      </div>
    </div>
  );
}