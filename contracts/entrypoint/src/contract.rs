use std::borrow::Borrow;
#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint64,HexBinary,Event
};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, UserOp};
use crate::state::{SCW_CODE_ID,COUNTER, SCW_MAP};
use sha2::{Digest, Sha256};

// // version info for migration info
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
    SCW_CODE_ID.save(deps.storage, &msg.scw_code_id)?;
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
        ExecuteMsg::HandleUserOps { UserOps } => {
            execute::handle_user_op(deps, env, UserOps)
        }
    }
}

pub mod execute {
    use std::borrow::BorrowMut;
    use std::vec;

    use cosmwasm_std::{Addr, Attribute, CosmosMsg, Event, HexBinary, StdError};
    use sha2::digest::typenum::private::IsNotEqualPrivate;
    use crate::ContractError::Std;
    use crate::msg::InstantiateMsgWallet;

    use crate::state::{COUNTER, SCW_MAP};

    use super::*;
    pub fn handle_user_op(deps: DepsMut, env:Env,ops: Vec<UserOp>) -> Result<Response, ContractError> {
        let mut msgs: Vec<CosmosMsg> = Vec::new();
        let mut attributes:Vec<Attribute> = Vec::new();

        for op in ops {
            if op.Calldata.is_empty(){
                // deploy new scw contract address
                let mut label_counter= COUNTER.load(deps.storage).unwrap_or_default();
                let code_id = SCW_CODE_ID.load(deps.storage)?.u64();
                let code_info = deps.querier.query_wasm_code_info(code_id.clone())?;
                let canonical_creator = deps.api.addr_canonicalize(env.contract.address.as_str())?;
                let address = cosmwasm_std::instantiate2_address(&code_info.checksum, &canonical_creator,&op.Pubkey.clone()).unwrap();
                let instantiate_msg = InstantiateMsgWallet {
                    owner: Addr::unchecked(op.Sender.clone().to_string()),
                };

                let serialized_msg = to_binary(&instantiate_msg).unwrap();
                let msg = CosmosMsg::Wasm(cosmwasm_std::WasmMsg::Instantiate2 {
                    admin: Some(op.Sender.clone().to_string()),
                    code_id,
                    label: label_counter.clone().into(),
                    msg: serialized_msg,
                    funds: vec![],
                    salt: op.Pubkey,
                });
                let human_addr= deps.api.addr_humanize(&address.clone())?;
                // increment and store label counter
                label_counter=label_counter.checked_add(Uint64::one()).unwrap();
                COUNTER.save(deps.storage, &label_counter)?;
                SCW_MAP.save(deps.storage,human_addr.clone(), &op.Sender)?;

                msgs.push(msg);
                attributes.push(Attribute::new("instantiate2",human_addr.into_string()));
            }
            else {
                let mut msg: CosmosMsg<_> = CosmosMsg::Wasm(cosmwasm_std::WasmMsg::Execute {
                    contract_addr: op.To.into_string(),
                    msg: op.Calldata,
                    funds: op.funds,
                });

                msgs.push(msg);
            }
        }
        Ok(Response::new().add_messages(msgs).add_attributes(attributes))
    }
}

pub fn sha256(msg: &[u8]) -> Vec<u8> {
    let mut hasher = Sha256::new();
    hasher.update(msg);
    return hasher.finalize().to_vec()
}
