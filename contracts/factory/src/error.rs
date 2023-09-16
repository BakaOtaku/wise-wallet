use cosmwasm_std::StdError;
use thiserror::Error;
use cosmwasm_std::Instantiate2AddressError;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("{0}")]
    InitAddressError(#[from] Instantiate2AddressError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Invalid Nonce for user {user}")]
    InvalidNonce { user: String },

    #[error("Insuffient funds {user}")]
    InsufficientFunds { user: String },
}
