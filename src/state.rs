use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::Addr;
use cw_storage_plus::{Item, Map};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct SwapOrder {
    pub order_requester: String,
    pub token_sell: String,
    pub token_bought: String,
    pub quantityOrder: u128,
    pub swap_upper_usd: u128,
    pub swap_lower_usd: u128,
    pub minimum_result_accepted_usd: u128,
    pub max_in_sell_usd: u128,
    pub is_token_out_order: bool,
}

pub const ORDER_ID_COUNTER: Item<u64> = Item::new("ORDER_ID_COUNTER");
pub const SwapOrderStore: Map<u64, SwapOrder> = Map::new("SwapOrderStore");
