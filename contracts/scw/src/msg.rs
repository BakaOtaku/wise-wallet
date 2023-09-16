use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Binary, Coin, Uint128, Uint64};

#[cw_serde]
pub struct InstantiateMsg {
    pub admin: Addr,
}

#[cw_serde]
pub enum ExecuteMsg {
    ChangeAdmin {
        new_admin: Addr,
    },

    DepositFundsNative {},

    DepositFundsCW20 {
        contract_addr: String,
        amount: Uint128,
    },

    ExecuteUserOp {
        user_op: UserOp,
    },

    SetSocialRecover {
        addrs: Vec<Addr>,
    },

    Recover {
        new_admin: Addr,
    },
}

#[cw_serde]
pub enum CW20Msg {
    TransferFrom {
        owner: String,
        recipient: String,
        amount: Uint128,
    },
}

#[cw_serde]
pub struct UserOp {
    pub sender: Addr,
    pub to: Addr,
    pub initcode:Option<Binary>,
    pub nonce: Uint128,
    pub calldata: Binary,
    pub signature: Option<Binary>,
    pub funds: Vec<Coin>,
    pub pubkey: Binary,
}
