use cw_controllers::Admin;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Uint256};
use cw_storage_plus::{Item, Map};

pub const ADMIN: Admin = Admin::new("admin");
pub const BALANCE: Map<&Addr, Uint256> = Map::new("BALANCE");
pub const SOCIAL_RECOVER: Map<&Addr, bool> = Map::new("SOCIAL_RECOVER");
