use cosmwasm_std::StdError;
use thiserror::Error;
use cw_controllers::AdminError;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("{0}")]
    Admin(#[from] AdminError),

    #[error("Invalid Nonce for user {user}")]
    InvalidNonce { user: String },

    #[error("Insuffient funds {user}")]
    InsufficientFunds { user: String },
}
