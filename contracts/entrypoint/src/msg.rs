use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Binary, Uint128, Uint64, Coin};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[cw_serde]
pub struct InstantiateMsg {
    pub scw_code_id: Uint64
}

#[cw_serde]
pub enum ExecuteMsg {
    HandleUserOps { UserOps: Vec<UserOp> },
}

#[cw_serde]
pub struct UserOp {
    pub Sender: Addr,
    pub To: Addr,
    pub Nonce: Uint128,
    pub Calldata: Binary,
    pub Signature: Option<Binary>,
    pub funds : Vec<Coin>,
    pub Pubkey: Binary,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsgWallet {
    pub owner: Addr,
}
