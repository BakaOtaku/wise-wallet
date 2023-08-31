# WiseWallet
<h6 align="center">Account Abstraction on Steroids</h6>
<h6 align="center">GPT solver, Limit hooks and much more</h6>

- [Presentation File 🗎 🔗](https://github.com/BakaOtaku/wise-wallet/blob/main/WiseWallet.pdf)
- [Presentation Video 🔗](https://www.youtube.com/watch?v=NkNnJ4hX1eE&feature=youtu.be)
- Deployed Contract
    ```
    entrypoint: nibi1436kxs0w2es6xlqpp9rd35e3d0cjnw4sv8j3a7483sgks29jqwgsn6ytm8
    
    limit: nibi1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqfdzd2w
    ```

## Abstract
WiseWallet seeks to redefine the way users interact with decentralized applications and execute transactions on the nibiru blockchain. Through the utilization of account abstraction, off-chain signing, bundlers, and our unique "Limit Hooks" feature, WiseWallet aims to provide an unmatched user experience that is both secure and efficient.

## 1. Introduction
With the rapid growth of the decentralized finance (DeFi) ecosystem, users demand greater flexibility, user-friendliness, and efficiency in their transactions. WiseWallet's innovative solutions answer this demand by offering a set of features not found together in any existing platform.

## 2. Account Abstraction
In the realm of blockchain and decentralized finance, the standard model of accounts and their interactions can often prove restrictive and counterintuitive to many users. Account Abstraction is a solution designed to make the user experience more seamless by breaking down traditional boundaries that separate contract accounts from externally owned accounts.

### 2.1 Conceptual Overview
Traditionally, blockchain systems like Ethereum have two primary types of accounts: Externally Owned Accounts (EOAs) and Contract Accounts. EOAs are controlled by private keys and have no associated code, whereas Contract Accounts are driven by their associated code and can't initiate new transactions by themselves.

Account Abstraction seeks to blur this distinction, creating a scenario where users and contracts can functionally interact with the blockchain in the same manner. By doing this, many complexities and challenges associated with contract interaction and gas payments are simplified or eliminated.

### 2.2 Features of WiseWallet's Account Abstraction
- **a) Off-chain Signing**: By allowing users to sign transactions off-chain, WiseWallet ensures:
  - Reduction in on-chain congestion as transactions don't need to be broadcasted immediately.
  - Enhanced privacy as off-chain data isn't immediately visible on the blockchain.
  - Immediate user feedback without waiting for blockchain confirmations.
  
- **b) Paymaster**: A designated entity within the WiseWallet ecosystem, the Paymaster manages:
  - Covering transaction gas fees, simplifying the user experience by eliminating the need for manual gas fee handling.
  - Refunding gas fees, if necessary, according to the platform's protocols.
  
- **c) Staking for Fees**: A user-friendly approach to transaction costs:
  - Users deposit a certain amount in their WiseWallet, designated for fees.
  - As transactions occur, their associated fees are automatically deducted from this staked amount.
  - Users can track, top-up, or withdraw from this staked amount, providing them complete control over their funds.

### 2.3 Benefits of Account Abstraction
- **Uniformity**: With blurred distinctions between contract and external accounts, users and developers can operate with a uniform interface, leading to streamlined operations and simpler codebases.
- **Enhanced Security**: As users sign transactions off-chain, the security of their private keys is inherently enhanced, reducing the exposure of sensitive data.
- **Flexibility**: Developers can design more flexible smart contracts, no longer restrained by the traditional transaction formats.
- **Simplified UX**: For end-users, the complexities of gas payments, contract interactions, and other nuances of blockchain operations become abstracted behind the scenes, making their experience smooth and intuitive.

## 3. Transaction Bundler
By bundling multiple transactions, WiseWallet facilitates reduced gas fees and faster processing times. This is especially beneficial for users executing numerous transactions in a short period, such as during peak trading times or dApp interactions.

## 4. Limit Hooks
One of WiseWallet's most innovative features, Limit Hooks enable users to set both timeless and time-bound limit orders with just off-chain signing.

### 4.1 How it Works
A user sets a desired limit for a transaction (buy/sell/swaps). The request remains dormant until the specified conditions are met. Once the criteria are achieved, the Solver API triggers and executes the transaction, charging a nominal commission for the service.

### 4.2 Use Cases
- **Price-based Transactions**: A user wants to buy Nibiru with all his nUSD when the Nibiru price drops to a certain level within a specified timeframe. With WiseWallet's Limit Hooks, the user can set this condition and continue his daily tasks without locking his tokens or continuously monitoring the market.
- **Depreciation Protection**: Users can shield themselves from token depreciation, e.g., if a stablecoin like XUSD falls below $0.98, the system can be set to automatically swap all XUSD to Nibiru, thus preserving the user's value.

## 5. Benefits
- **User-Friendly**: Off-chain signing and Limit Hooks make the platform simple to use, even for those new to the crypto space.
- **Flexible**: Timeless and time-bound limit orders give users the freedom to plan their transactions according to their needs.
- **Cost-Efficient**: Bundling of transactions can lead to reduced gas fees.
- **Secure**: Users retain control of their funds without locking them in, and off-chain signing ensures enhanced security.

## 6. Conclusion
WiseWallet's innovative approach to blockchain interactions is set to revolutionize how users perceive and utilize DeFi platforms. Through the combination of user-friendly features and forward-thinking solutions, WiseWallet presents a compelling platform for the future of blockchain-based transactions.

### Tech Stack
- Nibiru Oracle
- GPT-4
- Cosmwasm
- Nibiru Chain
- Rust and TS

### Team

- [ 👨🏻‍🎓 Arpit Srivastava](https://github.com/fuzious)
- [ 👨🏻‍💻 Aniket Dixit ](https://github.com/dixitaniket)
- [ 🌊 Aman Raj](https://amanraj.dev)
