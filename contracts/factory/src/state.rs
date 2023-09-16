use cw_controllers::Admin;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Uint256};
use cw_storage_plus::{Item, Map};

pub const CODE_ID: Item<u64> = Item::new("code_id");
pub const USER_NONCE: Map<Addr, u128> = Map::new("USER_NONCE");
pub const BALANCE: Map<&Addr, Uint256> = Map::new("BALANCE");
