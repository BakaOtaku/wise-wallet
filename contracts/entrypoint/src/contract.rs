#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    from_binary, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint64,
};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg};
use crate::state::FACTORY;
use factory::msg::ExecuteMsg::DeployScw;
use scw::msg::ExecuteMsg::ExecuteUserOp;
use scw::msg::UserOp;
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
    FACTORY.save(deps.storage, &msg.factory)?;
    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::HandleUserOps { UserOps } => execute::handle_user_op(deps, env, UserOps),
        ExecuteMsg::DepositFunds {} => {
            // let funds = info.funds;
            let sender = info.sender;
            // let mut exisiting = BALANCE.may_load(store, &sender)?.unwrap_or_default();
            // BALANCE.save(store, &sender, &exisiting.checked_add(&funds)?)?;
            Ok(Response::new().add_attribute("sender", sender.to_string()))
        }
    }
}

pub mod execute {
    use std::vec;

    use cosmwasm_std::{Addr, CosmosMsg, Uint256};

    use crate::msg::QueryMsg;

    use super::*;
    pub fn handle_user_op(
        deps: DepsMut,
        env: Env,
        ops: Vec<UserOp>,
    ) -> Result<Response, ContractError> {
        let mut msgs: Vec<CosmosMsg> = Vec::new();

        for op in ops {
            if op.initcode.is_some() {
                let initcode = op.initcode.unwrap();
                //TODO: might have to take admin from initcode binary maybe

                // call factory to deploy new contract
                let factory = FACTORY.load(deps.storage)?;
                let msg: CosmosMsg<_> = CosmosMsg::Wasm(cosmwasm_std::WasmMsg::Execute {
                    contract_addr: factory.to_string(),
                    msg: to_binary(&DeployScw { admin: op.sender })?,
                    funds: vec![],
                });

                return Ok(Response::new().add_message(msg));
            }

            //TODO: calculate scw address and send to there
            let scw_address: Addr = deps.querier.query_wasm_smart(
                FACTORY.load(deps.as_ref().storage)?,
                &to_binary(&QueryMsg::Address {
                    owner: op.sender.clone(),
                })?,
            )?;

            let mut msg: CosmosMsg<_> = CosmosMsg::Wasm(cosmwasm_std::WasmMsg::Execute {
                contract_addr: scw_address.to_string(),
                msg: to_binary(&ExecuteUserOp { user_op: op })?,
                funds: vec![],
            });

            msgs.push(msg);
        }
        Ok(Response::new().add_messages(msgs))
    }
}

pub fn sha256(msg: &[u8]) -> Vec<u8> {
    let mut hasher = Sha256::new();
    hasher.update(msg);
    hasher.finalize().to_vec()
}
