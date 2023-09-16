use crate::error::ContractError;
use crate::msg::{ ExecuteMsg, InitSCW, InstantiateMsg, QueryMsg};
use crate::state::{ CODE_ID,BALANCE, USER_NONCE};
#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    instantiate2_address, to_binary, Attribute, Binary, CodeInfoResponse, CosmosMsg, Deps, DepsMut,
    Env, MessageInfo, Reply, Response, StdResult, Uint64,
};
use cw2::set_contract_version;
use cw_controllers::Admin;
use sha2::{Digest, Sha256};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:wise-wallet";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");
const INSTANTIATE_REPLY_ID: u64 = 1u64;

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    CODE_ID.save(deps.storage, &msg.code_id.u64());
    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender)
        .add_attribute("code_id", msg.code_id.to_string()))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::DeployScw { admin } => {
            let code_id = CODE_ID.load(deps.storage)?;
            let init_msg = to_binary(&InitSCW { admin:admin.clone()})?;


            let CodeInfoResponse { checksum, .. } = deps.querier.query_wasm_code_info(code_id)?;
            let creator = deps.api.addr_canonicalize(env.contract.address.as_str())?;
            //TODO: salt calculation
            let salt = sha256(&to_binary("TODO")?);
            
            let mut label =String::from("scw_wise_wallet");
            label.push_str( &admin.to_string());
            let msg = cosmwasm_std::SubMsg::reply_on_success(
                CosmosMsg::Wasm(cosmwasm_std::WasmMsg::Instantiate2 {
                    admin: Some(admin.to_string()),
                    code_id,
                    msg: init_msg,
                    funds: vec![],
                    label:label,
                    salt: salt.into(),
                }),
                INSTANTIATE_REPLY_ID,
            );

            Ok(Response::new().add_submessage(msg))
        }
    }
}

pub fn sha256(msg: &[u8]) -> Vec<u8> {
    let mut hasher = Sha256::new();
    hasher.update(msg);
    hasher.finalize().to_vec()
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn reply(deps: DepsMut, env:Env,msg: Reply) -> StdResult<Response> {
    match msg.id {
        INSTANTIATE_REPLY_ID => {
            //TODO: process calldata back
            Ok(Response::default())
        }
        _=>{
            Ok(Response::default())
        }
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> Result<Binary,ContractError> {
    match msg {
        QueryMsg::Address { owner } => {
            let code_id = CODE_ID.load(deps.storage)?;
            let CodeInfoResponse { checksum, .. } = deps.querier.query_wasm_code_info(code_id)?;

            let creator = deps.api.addr_canonicalize(env.contract.address.as_str())?;
            let salt = sha256(&to_binary("TODO")?);
            let address = deps
                .api
                .addr_humanize(&instantiate2_address(&checksum, &creator, &salt.as_slice())?)?;

            Ok(to_binary(&address)?)
        }
    }
}