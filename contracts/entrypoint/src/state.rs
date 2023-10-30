use std::ops::Add;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Uint64};
use cw_storage_plus::{Item, Map};

pub const SCW_CODE_ID: Item<Uint64>= Item::new("SCW_CODE_ID");
pub const COUNTER: Item<Uint64> = Item::new("COUNTER");
pub const SCW_MAP:Map<Addr, Addr>= Map::new("MAP_SCW");
