use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Binary, Coin, Uint128, Uint64};
use cw_controllers::Admin;

#[cw_serde]
pub struct InstantiateMsg {
    pub code_id: Uint64,
}

#[cw_serde]
pub enum ExecuteMsg {
    DeployScw { admin: Addr },
}

#[cw_serde]
pub enum QueryMsg {
    Address { owner: Addr },
}

#[cw_serde]
pub struct InitSCW {
    pub admin: Addr,
}
