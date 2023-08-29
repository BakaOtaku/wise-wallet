#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{ORDER_ID_COUNTER};

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
    ORDER_ID_COUNTER.save(deps.storage,&0u64)?;
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
        ExecuteMsg::StoreSwapOrder { order_requester, token_sell, token_bought, quantityOrder, swap_upper_usd, swap_lower_usd, minimum_result_accepted_usd, max_in_sell_usd, is_token_out_order } => execute::storeSwapOrder(deps, info, order_requester.to_string(), token_sell.to_string(), token_bought.to_string(), quantityOrder, swap_upper_usd, swap_lower_usd, minimum_result_accepted_usd, max_in_sell_usd, is_token_out_order),
    }
}

pub mod execute {
    use crate::state::{ORDER_ID_COUNTER, SwapOrder, SwapOrderStore};
    use super::*;


    pub fn storeSwapOrder(deps: DepsMut, info: MessageInfo, order_requester: String, token_sell: String, token_bought: String, quantityOrder: u128, swap_upper_usd: u128, swap_lower_usd: u128, minimum_result_accepted_usd: u128, max_in_sell_usd: u128, is_token_out_order: bool) -> Result<Response, ContractError> {
        let x = info.sender.to_string();
        let swap_order = SwapOrder {
            order_requester,
            token_sell,
            token_bought,
            quantityOrder,
            swap_upper_usd,
            swap_lower_usd,
            minimum_result_accepted_usd,
            max_in_sell_usd,
            is_token_out_order
        };
        let order_id = ORDER_ID_COUNTER.update(deps.storage, |count| -> StdResult<_> {Ok(count + 1)})?;

        SwapOrderStore.save(deps.storage, order_id,&swap_order)?;
        Ok(Response::new().add_attribute("orderId", order_id.to_string()))
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetOrder { orderId } => to_binary(&query::getOrder(deps, orderId)?),
    }
}

pub mod query {
    use crate::msg::GetOrderResponse;
    use crate::state::{SwapOrder, SwapOrderStore};
    use super::*;

    pub fn getOrder(deps: Deps, orderId: u64) -> StdResult<GetOrderResponse> {
        let state = SwapOrderStore.load(deps.storage, orderId)?;
        Ok(GetOrderResponse { order: state })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{Addr, coins, from_binary};
    use crate::msg::GetOrderResponse;
    use crate::state::SwapOrder;


    #[test]
    fn test_instantiate_store_and_query_order() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let sender = "alice".to_string();
        let info = mock_info(&sender, &coins(2, "token"));

        // Instantiate
        let instantiate_msg = InstantiateMsg { };  // Adjust the InstantiateMsg accordingly
        let _res = instantiate(deps.as_mut(), env.clone(), info.clone(), instantiate_msg).unwrap();

        // Check attributes from instantiate response
        assert_eq!(_res.attributes[0], cosmwasm_std::Attribute {
            key: "method".to_string(),
            value: "instantiate".to_string(),
        });
        assert_eq!(_res.attributes[1], cosmwasm_std::Attribute {
            key: "owner".to_string(),
            value: sender.clone(),
        });

        // Store Swap Order
        let execute_msg = ExecuteMsg::StoreSwapOrder {
            order_requester: Addr::unchecked(sender.clone()),
            token_sell: Addr::unchecked("token_sell".to_string()),
            token_bought: Addr::unchecked("token_bought".to_string()),
            quantityOrder: 100,
            swap_upper_usd: 200,
            swap_lower_usd: 150,
            minimum_result_accepted_usd: 180,
            max_in_sell_usd: 190,
            is_token_out_order: true
        };

        let res = execute(deps.as_mut(), env.clone(), info.clone(), execute_msg).unwrap();

        // Assert orderId attribute (you can extend this to check other things as well)
        assert_eq!(res.attributes[0], cosmwasm_std::Attribute {
            key: "orderId".to_string(),
            value: "1".to_string(),
        });

        // Query the stored order
        let query_msg = QueryMsg::GetOrder { orderId: 1 };
        let bin_res = query(deps.as_ref(), env, query_msg).unwrap();
        let order_response: GetOrderResponse = from_binary(&bin_res).unwrap();

        // Check the order details
        assert_eq!(order_response.order.order_requester, sender);
        assert_eq!(order_response.order.token_sell, "token_sell");
        assert_eq!(order_response.order.token_bought, "token_bought");
        assert_eq!(order_response.order.quantityOrder, 100);
        assert_eq!(order_response.order.swap_upper_usd, 200);
        assert_eq!(order_response.order.swap_lower_usd, 150);
        assert_eq!(order_response.order.minimum_result_accepted_usd, 180);
        assert_eq!(order_response.order.max_in_sell_usd, 190);
        assert_eq!(order_response.order.is_token_out_order, true);
    }
}
