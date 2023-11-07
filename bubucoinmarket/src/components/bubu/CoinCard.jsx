import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./index.css";
import { BsArrowDownShort } from "react-icons/bs";

function formatNumber(value) {
  if (value >= 1e12) {
    return (value / 1e12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' trillion';
  } else if (value >= 1e9) {
    return (value / 1e9).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' billion';
  } else {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}


const CoinDetails = ({ coin, onClose }) => {
  const [buyValue, setBuyValue] = useState('');
  const [buyQuantity, setBuyQuantity] = useState('');

  const handleValueChange = (event) => {
    const value = event.target.value;
    setBuyValue(value);
    setBuyQuantity(value / coin.price);
  };

  const handleQuantityChange = (event) => {
    const quantity = event.target.value;
    setBuyQuantity(quantity);
    const roundedValue = (quantity * coin.price).toFixed(2);
    setBuyValue(roundedValue);
  };

  const handleBuySell = async (action) => {
    // Construir o objeto de dados a ser enviado para o backend
    const postData = {
      title: coin.name,
      action: action, // Ação agora é passada como parâmetro
      value: buyValue,
      quant: buyQuantity,
    };

    try {
      // Enviar a requisição POST para o seu endpoint
      const response = await axios.post('http://127.0.0.1:8000/api/coins', postData);
      console.log(response.data); // Exibir a resposta do backend, se necessário
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="coin-details">
      <button className="butao-close" onClick={onClose}>Close</button>
      <h2>{coin.name}</h2>
      {/* Add other details you want to display */}
      <div className="valores">
        <div>
          <label htmlFor="buyValue">USD : </label>
          <input
            type="number"
            id="buyValue"
            value={buyValue}
            onChange={handleValueChange}
          />
        </div>
        <div className="buy-quant">
          <label htmlFor="buyQuantity">UND : </label>
          <input
            type="number"
            id="buyQuantity"
            value={buyQuantity}
            onChange={handleQuantityChange}
          />
        </div>
      </div>
      <div className="butoes">
        <button className="butao-buy" onClick={() => handleBuySell('buy')}>Buy</button>
        <button className="butao-sell" onClick={() => handleBuySell('sell')}>Sell</button>
      </div>
    </div>
  );
};

const CoinCard = () => {
  const [coinData, setCoinData] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: 'GET',
        url: 'https://coinranking1.p.rapidapi.com/coins',
        params: {
          referenceCurrencyUuid: 'yhjMzLPhuIDl',
          timePeriod: '24h',
          'tiers[0]': '1',
          orderBy: 'marketCap',
          orderDirection: 'desc',
          limit: '50',
          offset: '0'
        },
        headers: {
          'X-RapidAPI-Key': '117349bc25msh85bb13bcc407571p1a402ejsne809e7e70777',
          'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        setCoinData(response.data.data.coins);
        console.log(response.data.data.coins);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const showCoinDetails = (coin) => {
    setSelectedCoin(coin);
  };

  const closeCoinDetails = () => {
    setSelectedCoin(null);
  };

  return (
    <div>
      {coinData && coinData.map((coin) => (
        <div key={coin.uuid}>
          <div><BsArrowDownShort onClick={() => showCoinDetails(coin)} /></div>
          <div className="card" key={coin.uuid}>
            <div className="card-content">
              <div className="pack">
                <img
                  src={coin.iconUrl}
                  alt={coin.name}
                  className="coin-icon"
                />
                <div className="names">
                  <p className="symbol"> {coin.symbol}</p>
                </div>
              </div>
              <p className="price">$ {Number(coin.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="market-cap">$ {formatNumber(coin.marketCap)}</p>
              <p className={`change ${coin.change < 0 ? 'negative' : 'positive'}`}> {coin.change < 0 ? coin.change : `+${coin.change}`}%</p>
            </div>
          </div>
          {selectedCoin && selectedCoin.uuid === coin.uuid && (
            <CoinDetails coin={selectedCoin} onClose={closeCoinDetails} />
          )}
        </div>
      ))}
    </div>
  );
};

export default CoinCard;
