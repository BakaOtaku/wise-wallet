use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Uint256};
use cw_storage_plus::{Item, Map};

pub const FACTORY: Item<Addr> = Item::new("FACTORY");
