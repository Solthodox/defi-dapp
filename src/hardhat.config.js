/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: "fuuji",
  networks: {
  fuuji: {
    url: "https://api.avax-test.network/ext/C/rpc",
    accounts: ["e017da6f3d3c8d09ddf65e1a1bbd78fc80b9e64e61f1fb5f8c2deef7ea545e49"]
  }
}
};
