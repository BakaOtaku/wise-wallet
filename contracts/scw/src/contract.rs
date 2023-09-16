use crate::error::ContractError;
use crate::msg::{CW20Msg, ExecuteMsg, InstantiateMsg, UserOp};
use crate::state::{ADMIN, BALANCE, SOCIAL_RECOVER};
#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    instantiate2_address, to_binary, Attribute, Binary, CosmosMsg, Deps, DepsMut, Env, MessageInfo,
    Response, StdResult, Uint64, wasm_execute,
};
use cw2::set_contract_version;
use cw_controllers::Admin;
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
    ADMIN.set(deps, Some(msg.admin))?;
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
        ExecuteMsg::ChangeAdmin { new_admin } => {
            ADMIN.assert_admin(deps.as_ref(), &info.sender)?;
            Ok(ADMIN.execute_update_admin(deps, info, Some(new_admin))?)
        }

        ExecuteMsg::DepositFundsNative {} => {
            let mut attributes: Vec<Attribute>=Vec::new();
            for coin in info.funds {
                attributes.push(Attribute::new(coin.denom, coin.amount.to_string()));
            }

            Ok(Response::new()
                .add_attribute("sender", info.sender.to_string())
                .add_attributes(attributes))
        }

        ExecuteMsg::DepositFundsCW20 {
            contract_addr,
            amount,
        } => {

            let transfer_msg = to_binary(&CW20Msg::TransferFrom {
                owner: info.sender.to_string(),
                recipient: env.contract.address.to_string(),
                amount: amount,
            })?;

            let msg = CosmosMsg::Wasm(wasm_execute(
                contract_addr,
                &transfer_msg,
                vec![]
            )?);

            Ok(Response::new().add_message(msg))
        }

        ExecuteMsg::ExecuteUserOp { user_op } => {
            //TODO: signature check

            let msg = CosmosMsg::Wasm(wasm_execute(user_op.to, &user_op.calldata, user_op.funds)?);

            Ok(Response::new().add_message(msg))
        }

        ExecuteMsg::SetSocialRecover { addrs } => {
            ADMIN.assert_admin(deps.as_ref(), &info.sender)?;
            let mut attributes: Vec<Attribute>=Vec::new();
            for addr in addrs {
                SOCIAL_RECOVER.save(deps.storage, &addr, &true)?;
                attributes.push(Attribute::new("added address", addr.to_string()));
            }

            Ok(Response::new().add_attributes(attributes))
        }
        ExecuteMsg::Recover { new_admin } => {
            //TODO: voting system
            Ok(Response::new())
        }
    }
}

pub fn sha256(msg: &[u8]) -> Vec<u8> {
    let mut hasher = Sha256::new();
    hasher.update(msg);
    hasher.finalize().to_vec()
}
