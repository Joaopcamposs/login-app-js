
import axios from 'axios';

// Hook personalizado para fazer requisições com timeout
export default function useAxiosWithTimeout() {
  const makeRequest = async (config, timeout = 30000) => {
    const source = axios.CancelToken.source();
    const timeoutId = setTimeout(() => {
      source.cancel(`A requisição demorou muito e foi cancelada após ${timeout / 1000} segundos.`);
    }, timeout);

    try {
      const response = await axios({
        ...config,
        cancelToken: source.token,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err.response ? err.response.data.detail : err.message;
    }
  };

  return { makeRequest };
}
