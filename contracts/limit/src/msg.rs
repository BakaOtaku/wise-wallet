use crate::state::SwapOrder;
use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, CustomQuery, Decimal, QuerierWrapper, StdResult, Uint64};
use std::collections::HashMap;

#[cw_serde]
pub struct InstantiateMsg {}

#[cw_serde]
pub enum ExecuteMsg {
    StoreSwapOrder {
        to: String,
        order_requester: Addr,
        token_sell: Addr,
        token_bought: Addr,
        quantity_order: u128,
        swap_upper_usd: u128,
        swap_lower_usd: u128,
        minimum_result_accepted_usd: u128,
        max_in_sell_usd: u128,
        is_token_out_order: bool,
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

#[cw_serde]
pub enum QueryperpMsg {
    OraclePrices {},
}

impl CustomQuery for QueryperpMsg {}
pub struct NibiruQuerier<'a> {
    querier: &'a QuerierWrapper<'a, QueryperpMsg>,
}

impl<'a> NibiruQuerier<'a> {
    pub fn new(querier: &'a QuerierWrapper<QueryperpMsg>) -> Self {
        NibiruQuerier { querier }
    }

    pub fn oracle_prices(&self, pairs: Option<Vec<String>>) -> StdResult<OraclePricesResponse> {
        let request = QueryperpMsg::OraclePrices {};
        let price_map: OraclePricesResponse = self.querier.query(&request.into())?;

        let mut out_price_map: OraclePricesResponse;
        if pairs.is_none() || pairs.as_ref().unwrap().is_empty() {
            out_price_map = price_map;
        } else {
            let pair_vec: Vec<String> = pairs.unwrap();
            out_price_map = HashMap::new();
            for p in &pair_vec {
                match price_map.get(p) {
                    Some(rate) => out_price_map.insert(p.clone(), *rate),
                    None => continue,
                };
            }
        }

        Ok(out_price_map)
    }
}

pub type OraclePricesResponse = HashMap<String, Decimal>;

// We define a custom struct for each query response
#[cw_serde]
pub struct GetOrderResponse {
    pub order: SwapOrder,
}
