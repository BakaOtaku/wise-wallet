#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_binary, to_vec, Binary, ContractResult, Decimal, Deps, DepsMut, Empty, Env, MessageInfo,
    QueryRequest, Response, StdError, StdResult, SystemError, SystemResult, Uint64,
};
use cw2::set_contract_version;
use cw20::Cw20ExecuteMsg::Transfer;

use self::execute::execute_order;
use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::ORDER_ID_COUNTER;
use anybuf::Anybuf;
use base64::decode;
use bech32::encode;

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
    ORDER_ID_COUNTER.save(deps.storage, &0u64)?;
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
        ExecuteMsg::StoreSwapOrder {
            to,
            order_requester,
            token_sell,
            token_bought,
            quantity_order,
            swap_upper_usd,
            swap_lower_usd,
            minimum_result_accepted_usd,
            max_in_sell_usd,
            is_token_out_order,
            pair_id,
        } => execute::store_swap_order(
            deps,
            info,
            to,
            order_requester.to_string(),
            token_sell.to_string(),
            token_bought.to_string(),
            quantity_order,
            swap_upper_usd,
            swap_lower_usd,
            minimum_result_accepted_usd,
            max_in_sell_usd,
            is_token_out_order,
            pair_id
        ),

        ExecuteMsg::ExecuteSwapOrder { order_id } => execute_order(deps, order_id.u64()),
    }
}

pub mod execute {
    use std::{default, io::Stderr};

    use cosmwasm_std::{CosmosMsg, CustomMsg, WasmMsg, Coin, Uint128, Coins};
    use cw20::Cw20ExecuteMsg;
    use prost::Message;
    use serde::de;

    use super::*;
    use crate::state::{SwapOrder, ORDER_ID_COUNTER, SWAP_ORDER_STORE};
    

    pub fn store_swap_order(
        deps: DepsMut,
        info: MessageInfo,
        to: String,
        order_requester: String,
        token_sell: String,
        token_bought: String,
        quantity_order: Uint128,
        swap_upper_usd: Uint128,
        swap_lower_usd: Uint128,
        minimum_result_accepted_usd: Uint128,
        max_in_sell_usd: Uint128,
        is_token_out_order: bool,
        pair_id:Option<Uint64>
    ) -> Result<Response, ContractError> {
        let x = info.sender.to_string();
        let swap_order = SwapOrder {
            to,
            order_requester,
            token_sell,
            token_bought,
            quantity_order:quantity_order.into(),
            swap_upper_usd:swap_upper_usd.into(),
            swap_lower_usd:swap_lower_usd.into(),
            minimum_result_accepted_usd:minimum_result_accepted_usd.into(),
            max_in_sell_usd:max_in_sell_usd.into(),
            is_token_out_order,
            pair_id
        };
        let order_id =
            ORDER_ID_COUNTER.update(deps.storage, |count| -> StdResult<_> { Ok(count + 1) })?;
        SWAP_ORDER_STORE.save(deps.storage, order_id, &swap_order)?;

        // execute if possible
        Ok(Response::new().add_attribute("orderId", order_id.to_string()))
    }

    pub fn execute_order(
        deps: DepsMut,
        order_id: u64,
    ) -> Result<Response, ContractError> {
        let mut swap_order:SwapOrder = SWAP_ORDER_STORE.load(deps.storage, order_id)?;
        let mut pair = swap_order.token_sell.clone();
        
        // perform oracle call, assume 1-1 
        // bank transfer 

        let mut msg: CosmosMsg;
        if swap_order.token_bought.eq("ucmdx"){
            msg = CosmosMsg::Bank(
                cosmwasm_std::BankMsg::Send { to_address: swap_order.to, amount: vec![Coin::new(swap_order.quantity_order, swap_order.token_bought)] }
            )
        }
        else {
        msg = CosmosMsg::Wasm(WasmMsg::Execute {
            contract_addr: swap_order.token_bought,
            msg: to_binary(&Cw20ExecuteMsg::Transfer {
                recipient: swap_order.to,
                amount: Uint128::from(swap_order.quantity_order)
            })?,
            funds: vec![],
        });
    }

        Ok(Response::new().add_message(msg))
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetOrder { orderId } => to_binary(&query::get_order(deps, orderId)?),
    }
}

pub mod query {
    use super::*;
    use crate::msg::GetOrderResponse;
    use crate::state::{SwapOrder, SWAP_ORDER_STORE};

    pub fn get_order(deps: Deps, orderId: u64) -> StdResult<GetOrderResponse> {
        let state = SWAP_ORDER_STORE.load(deps.storage, orderId)?;

        Ok(GetOrderResponse { order: state })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::msg::GetOrderResponse;
    use crate::state::SwapOrder;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, from_binary, Addr};

    #[test]
    fn test_instantiate_store_and_query_order() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let sender = "alice".to_string();
        let info = mock_info(&sender, &coins(2, "token"));

        // Instantiate
        let instantiate_msg = InstantiateMsg {}; // Adjust the InstantiateMsg accordingly
        let _res = instantiate(deps.as_mut(), env.clone(), info.clone(), instantiate_msg).unwrap();

        // Check attributes from instantiate response
        assert_eq!(
            _res.attributes[0],
            cosmwasm_std::Attribute {
                key: "method".to_string(),
                value: "instantiate".to_string(),
            }
        );
        assert_eq!(
            _res.attributes[1],
            cosmwasm_std::Attribute {
                key: "owner".to_string(),
                value: sender.clone(),
            }
        );

        // Store Swap Order
        let execute_msg = ExecuteMsg::StoreSwapOrder {
            order_requester: Addr::unchecked(sender.clone()),
            token_sell: Addr::unchecked("token_sell".to_string()),
            token_bought: Addr::unchecked("token_bought".to_string()),
            quantity_order: 100,
            swap_upper_usd: 200,
            swap_lower_usd: 150,
            minimum_result_accepted_usd: 180,
            max_in_sell_usd: 190,
            is_token_out_order: true,
        };

        let res = execute(deps.as_mut(), env.clone(), info.clone(), execute_msg).unwrap();

        // Assert orderId attribute (you can extend this to check other things as well)
        assert_eq!(
            res.attributes[0],
            cosmwasm_std::Attribute {
                key: "orderId".to_string(),
                value: "1".to_string(),
            }
        );

        // Query the stored order
        let query_msg = QueryMsg::GetOrder { orderId: 1 };
        let bin_res = query(deps.as_ref(), env, query_msg).unwrap();
        let order_response: GetOrderResponse = from_binary(&bin_res).unwrap();

        // Check the order details
        assert_eq!(order_response.order.order_requester, sender);
        assert_eq!(order_response.order.token_sell, "token_sell");
        assert_eq!(order_response.order.token_bought, "token_bought");
        assert_eq!(order_response.order.quantity_order, 100);
        assert_eq!(order_response.order.swap_upper_usd, 200);
        assert_eq!(order_response.order.swap_lower_usd, 150);
        assert_eq!(order_response.order.minimum_result_accepted_usd, 180);
        assert_eq!(order_response.order.max_in_sell_usd, 190);
        assert_eq!(order_response.order.is_token_out_order, true);
    }
}
