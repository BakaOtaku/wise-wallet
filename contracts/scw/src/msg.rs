use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Binary, Coin, Uint128, Uint64};

#[cw_serde]
pub struct InstantiateMsg {
    pub owner: Addr
}

#[cw_serde]
pub enum ExecuteMsg {
    HandleUserOps { UserOps: BatchUserOp },
    SetRecoveryHelpers { helpers: Vec<Addr> },
    ChangeOwner { new_owner: Addr },
}

#[cw_serde]
pub struct SingleUserOp {
    pub To: Addr,
    pub Calldata: Binary,
    pub funds: Vec<Coin>,
}

#[cw_serde]
pub struct BatchUserOp {
    pub Sender: Addr,
    pub Ops: Vec<SingleUserOp>,
    pub Nonce: Uint128,
    pub Signature: Option<Binary>,
    pub Pubkey: Binary,
}
