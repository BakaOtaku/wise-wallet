#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint64,
};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, UserOp};
use crate::state::USER_NONCE;
use sha2::{Digest, Sha256};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:wise-wallet";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::HandleUserOps { UserOps } => execute::handle_user_op(deps, UserOps),
    }
}

pub mod execute {
    use std::vec;

    use cosmwasm_std::CosmosMsg;

    use super::*;
    pub fn handle_user_op(deps: DepsMut, ops: Vec<UserOp>) -> Result<Response, ContractError> {
        let mut msgs: Vec<CosmosMsg> = Vec::new();

        for op in ops {
            // check for signature and nonce
            let usernonce = USER_NONCE
                .load(deps.storage, op.Sender.clone())
                .unwrap_or_default();
            if usernonce + 1 != op.Nonce.u128() {
                return Err(ContractError::InvalidNonce {
                    user: op.Sender.to_string(),
                });
            }

            let mut msg: CosmosMsg<_> = CosmosMsg::Wasm(cosmwasm_std::WasmMsg::Execute {
                contract_addr: op.To.into_string(),
                msg: op.Calldata,
                funds: vec![],
            });

            let bin_msg = to_binary(&msg)?;
            let hash = sha256(&bin_msg);
            let sig = op.Signature.unwrap();

            if !deps
                .api
                .secp256k1_verify(&hash, &sig, &op.Pubkey)
                .unwrap_or_default()
            {
                return Err(ContractError::Unauthorized {});
            }

            msgs.push(msg);
        }
        Ok(Response::new())
    }
}

pub fn sha256(msg: &[u8]) -> Vec<u8> {
    let mut hasher = Sha256::new();
    hasher.update(msg);
    hasher.finalize().to_vec()
}
