#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint64,
};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, BatchUserOp};
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
        ExecuteMsg::HandleUserOps { UserOps } => execute::handle_batch_user_op(deps, UserOps),
    }
}

pub mod execute {
    use std::vec;

    use cosmwasm_std::CosmosMsg;
    use crate::msg::BatchUserOp;

    use super::*;
    pub fn handle_batch_user_op(
        deps: DepsMut,
        batch_op: BatchUserOp,
    ) -> Result<Response, ContractError> {
        let mut msgs: Vec<CosmosMsg> = Vec::new();

        // Check the nonce once for the entire batch
        let usernonce = USER_NONCE
            .load(deps.storage, batch_op.Sender)
            .unwrap_or_default();
        if usernonce + 1 != batch_op.Nonce.u128() {
            return Err(ContractError::InvalidNonce {
                user: batch_op.Sender.to_string(),
            });
        }

        // Construct a piece of data representing the entire batch to verify the signature
        let mut all_bin_msgs = Vec::new();
        for op in &batch_op.Ops {
            let msg: CosmosMsg<_> = CosmosMsg::Wasm(cosmwasm_std::WasmMsg::Execute {
                contract_addr: op.To.into_string(),
                msg: op.Calldata.clone(),
                funds: op.funds.clone(),
            });
            all_bin_msgs.push(to_binary(&msg)?);
            msgs.push(msg);
        }

        let combined_data: Vec<u8> = all_bin_msgs.into_iter().flat_map(|b| b.0).collect();
        let hash = sha256(&combined_data);
        let sig = batch_op.Signature.clone().unwrap();

        if !deps
            .api
            .secp256k1_verify(&hash, &sig, &batch_op.Pubkey)
            .unwrap_or_default()
        {
            return Err(ContractError::Unauthorized {});
        }

        Ok(Response::new().add_messages(msgs))
    }

}

pub fn sha256(msg: &[u8]) -> Result<Vec<u8>, der::error::Error> {
    let mut hasher = Sha256::new();
    hasher.update(msg);
    let result = hasher.finalize().to_vec();
    Ok(result)
}


#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, from_binary, Addr, Uint128};
    use crate::msg::SingleUserOp;

    #[test]
    fn test_handle_batch_user_op() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let sender = "sender".to_string();
        let info = mock_info(&sender, &coins(1000, "earth"));

        // Create a mock BatchUserOp
        let ops = BatchUserOp {
            Sender: Addr::unchecked(sender.clone()),
            Ops: vec![
                SingleUserOp {
                    To: Addr::unchecked("contract1"),
                    Calldata: Binary::from(b"do something".to_vec()),
                    funds: coins(500, "earth"),
                },
                SingleUserOp {
                    To: Addr::unchecked("contract2"),
                    Calldata: Binary::from(b"do something else".to_vec()),
                    funds: coins(300, "earth"),
                },
            ],
            Nonce: Uint128::from(1u64),
            Signature: Some(Binary::from(b"fake_signature".to_vec())),
            Pubkey: Binary::from(b"fake_pubkey".to_vec()),
        };

        let execute_msg = ExecuteMsg::HandleUserOps { UserOps: ops };

        // Call the execute function
        let result = execute(deps.as_mut(), env.clone(), info.clone(), execute_msg);

        // Assert Unauthorized error due to fake signature
        assert_eq!(
            result.unwrap_err(),
            ContractError::Unauthorized {}
        );

        // Additional assertions can be added as required based on the logic
        // For example, you can store and query data similar to the provided test,
        // and check the expected results.
    }
}
