use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::Addr;
use crate::state::SwapOrder;

#[cw_serde]
pub struct InstantiateMsg {}

#[cw_serde]
pub enum ExecuteMsg {
    StoreSwapOrder {
        order_requester: Addr,
        token_sell: Addr,
        token_bought: Addr,
        quantityOrder: u128,
        swap_upper_usd: u128,
        swap_lower_usd: u128,
        minimum_result_accepted_usd: u128,
        max_in_sell_usd: u128,
        is_token_out_order: bool
    },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    // GetCount returns the current count as a json-encoded number
    #[returns(GetOrderResponse)]
    GetOrder {
        orderId: u64
    },
}

// We define a custom struct for each query response
#[cw_serde]
pub struct GetOrderResponse {
    pub order: SwapOrder,
}
