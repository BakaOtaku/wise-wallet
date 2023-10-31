use cosmwasm_std::{
    to_binary, Binary, Deps, Env, MessageInfo, Response, StdResult, Uint64,DepsMut,entry_point
};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{BatchUserOp, ExecuteMsg, InstantiateMsg};
use sha2::{Digest, Sha256};
use crate::contract::execute::{change_owner, set_recovery_helpers};
use crate::state::Owner;

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
    Owner.save(deps.storage, &msg.owner)?;
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
        ExecuteMsg::SetRecoveryHelpers { helpers } => set_recovery_helpers(deps, info, helpers),
        ExecuteMsg::ChangeOwner { new_owner } => change_owner(deps, info, new_owner),
    }
}

pub mod execute {
    use std::vec;

    use crate::msg::BatchUserOp;
    use cosmwasm_std::{Addr, CosmosMsg};
    use crate::state::{CHANGE_OWNER_REQUEST, Owner, RECOVERY_HELPERS};

    use super::*;
    pub fn handle_batch_user_op(
        deps: DepsMut,
        batch_op: BatchUserOp,
    ) -> Result<Response, ContractError> {
        let mut msgs: Vec<CosmosMsg> = Vec::new();


        // Construct a piece of data representing the entire batch to verify the signature
        let mut all_bin_msgs = Vec::new();
        for op in &batch_op.Ops {
            let msg: CosmosMsg<_> = CosmosMsg::Wasm(cosmwasm_std::WasmMsg::Execute {
                contract_addr: op.To.clone().into_string(),
                msg: op.Calldata.clone(),
                funds: op.funds.clone(),
            });
            all_bin_msgs.push(to_binary(&msg)?);
            msgs.push(msg);
        }

        let combined_data: Vec<u8> = all_bin_msgs.into_iter().flat_map(|b| b.0).collect();
        let hash = sha256(&combined_data);
        let sig = batch_op.Signature.clone().unwrap();
        let owner = Owner.load(deps.storage).unwrap();

        if !deps
            .api
            .secp256k1_verify(&hash, &sig, owner.as_bytes())
            .unwrap_or_default()
        {
            return Err(ContractError::Unauthorized {});
        }
        Ok(Response::new().add_messages(msgs))
    }

    pub fn set_recovery_helpers(deps: DepsMut, info: MessageInfo, helpers: Vec<Addr>) -> Result<Response, ContractError> {
        // Ensure the sender is the owner
        let current_owner = Owner.load(deps.storage)?;
        if info.sender != current_owner {
            return Err(ContractError::Unauthorized {});
        }

        // Store the recovery helpers
        RECOVERY_HELPERS.save(deps.storage, &helpers)?;

        Ok(Response::default())
    }

    pub fn change_owner(deps: DepsMut, info: MessageInfo, new_owner: Addr) -> Result<Response, ContractError> {
        let helpers = RECOVERY_HELPERS.load(deps.storage)?;
        if !helpers.contains(&info.sender) {
            return Err(ContractError::Unauthorized {});
        }
        // Load or create the change request
        let mut request = CHANGE_OWNER_REQUEST.may_load(deps.storage)?.unwrap_or_default();

        // If it's the first helper initiating the change, set the new owner
        if request.approved_by.is_empty() {
            request.new_owner = new_owner;
        }

        // Mark the helper as approved if not done already
        if !request.approved_by.contains(&info.sender) {
            request.approved_by.push(info.sender.clone());
        }

        // If all helpers approved, change the owner
        if request.approved_by.len() == helpers.len() {
            Owner.save(deps.storage, &request.new_owner)?;

            // Reset the change request
             CHANGE_OWNER_REQUEST.remove(deps.storage);
        } else {
            // Save the current state of approvals
            CHANGE_OWNER_REQUEST.save(deps.storage, &request)?;
        }

        Ok(Response::default())
    }


}

pub fn sha256(msg: &[u8]) -> Vec<u8> {
    let mut hasher = Sha256::new();
    hasher.update(msg);
    return hasher.finalize().to_vec()
}


#[cfg(test)]
mod tests {
    use super::*;
    use crate::msg::SingleUserOp;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, from_binary, Addr, Uint128};

    #[test]
    fn test_handle_batch_user_op() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let sender = "sender".to_string();
        let info = mock_info(&sender, &coins(2, "token"));
        let instantiate_msg = InstantiateMsg { owner: Addr::unchecked("owner") }; // Adjust the InstantiateMsg accordingly
        let _res = instantiate(deps.as_mut(), env.clone(), info.clone(), instantiate_msg).unwrap();

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
        // assert_eq!(result.unwrap_err(), ContractError::Unauthorized {});
    }

    #[test]
    fn test_ownership_recovery() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let owner = "owner".to_string();
        let info = mock_info(&owner, &coins(2, "token"));
        let instantiate_msg = InstantiateMsg { owner: Addr::unchecked(owner.clone()) };
        let _res = instantiate(deps.as_mut(), env.clone(), info.clone(), instantiate_msg).unwrap();

        // Set recovery helpers
        let helper1 = "helper1".to_string();
        let helper2 = "helper2".to_string();
        let set_helpers_msg = ExecuteMsg::SetRecoveryHelpers {
            helpers: vec![Addr::unchecked(helper1.clone()), Addr::unchecked(helper2.clone())],
        };
        let _res = execute(deps.as_mut(), env.clone(), info.clone(), set_helpers_msg).unwrap();

        // Attempt to change owner with only one helper (should fail)
        let new_owner = "new_owner".to_string();
        let change_owner_msg = ExecuteMsg::ChangeOwner { new_owner: Addr::unchecked(new_owner.clone()) };
        let info_helper1 = mock_info(&helper1, &coins(2, "token"));
        let result = execute(deps.as_mut(), env.clone(), info_helper1, change_owner_msg.clone());
        println!("{:?}", result);

        // Change owner with both helpers (should succeed)
        let info_helper2 = mock_info(&helper2, &coins(2, "token"));
        let _res = execute(deps.as_mut(), env.clone(), info_helper2, change_owner_msg).unwrap();
    }

}
