export const SARISKA_API_KEY = process.env.REACT_APP_SARISKA_MEET_APP_API_KEY;
export const MESSAGING_API_SERVICE_HOST = `${process.env.REACT_APP_API_SERVICE_HOST}/api/v1/messaging`;
export const WEB_SOCKET_URL = `${process.env.REACT_APP_WEBSOCKET_SERVICE_HOST}/api/v1/messaging/websocket`;
export const SARISKA_WEBSITE = 'https://sariska.io';
export const SARISKA_COMPANY_NAME = 'Sariska.io';

// export const SARISKA_API_SERVICE_HOST = process.env.NODE_ENV === 'development' ? 'https://api.dev.sariska.io' :  'https://api.sariska.io';
// export const SARISKA_API_KEY = process.env.NODE_ENV === 'development' ? "2ffd6f9497ce12122f30d5ec26f1ed923a8a47f98ebc2a8f2b" : '27fd6f9e85c304447d3cc0fb31e7ba8062df58af86ac3f9437';

// export const MESSAGING_API_SERVICE_HOST = process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api/v1/messaging' ?? 'https://api.dev.sariska.io/api/v1/messaging' : 'https://api.sariska.io/api/v1/messaging';
// export const WEB_SOCKET_URL = process.env.NODE_ENV === 'development' ? 'ws://localhost:4000/api/v1/messaging/websocket' ?? "wss://api.dev.sariska.io/api/v1/messaging/websocket" :  "wss://api.sariska.io/api/v1/messaging/websocket";
// export const SARISKA_WEBSITE = 'https://sariska.io';
// export const SARISKA_COMPANY_NAME = 'Sariska.io';