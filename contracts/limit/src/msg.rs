use crate::state::SwapOrder;
use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, CustomQuery, Decimal, QuerierWrapper, StdResult, Uint64, Uint128, CustomMsg, CosmosMsg, Coin};
use std::collections::HashMap;

#[cw_serde]
pub struct InstantiateMsg {}


#[cw_serde]
pub enum ExecuteMsg {
    StoreSwapOrder {
        to: String,
        order_requester: Addr,
        token_sell: String,
        token_bought: String,
        quantity_order: Uint128,
        swap_upper_usd: Uint128,
        swap_lower_usd: Uint128,
        minimum_result_accepted_usd: Uint128,
        max_in_sell_usd: Uint128,
        is_token_out_order: bool,
        pair_id:Option<Uint64>
    },

    ExecuteSwapOrder {
        order_id: Uint64,
    },
}




#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    // GetCount returns the current count as a json-encoded number
    #[returns(GetOrderResponse)]
    GetOrder { orderId: u64 },

}

// We define a custom struct for each query response
#[cw_serde]
pub struct GetOrderResponse {
    pub order: SwapOrder,
}
