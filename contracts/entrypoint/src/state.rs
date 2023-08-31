use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::Addr;
use cw_storage_plus::{Item, Map};

pub const USER_NONCE: Map<Addr, u128> = Map::new("USER_NONCE");
