use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Binary, Coin, Uint128, Uint64};
use scw::msg::UserOp;

#[cw_serde]
pub struct InstantiateMsg {
    pub factory: Addr,
}

#[cw_serde]
pub enum ExecuteMsg {
    HandleUserOps { UserOps: Vec<UserOp> },

    DepositFunds {},
}

#[cw_serde]
pub enum QueryMsg {
    Address { owner: Addr },
}
