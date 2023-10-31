use cosmwasm_schema::cw_serde;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::Addr;
use cw_storage_plus::{Item, Map};

#[cw_serde]
pub struct ChangeOwnerRequest {
    pub new_owner: Addr,
    pub approved_by: Vec<Addr>,
}

impl Default for ChangeOwnerRequest {
    fn default() -> Self {
        ChangeOwnerRequest {
            new_owner: Addr::unchecked(""), // or some other default value
            approved_by: Vec::new(),
        }
    }
}


pub const Owner: Item<Addr> = Item::new("owner");
pub const RECOVERY_HELPERS: Item<Vec<Addr>> = Item::new("recovery_helpers");
pub const CHANGE_OWNER_REQUEST: Item<ChangeOwnerRequest> = Item::new("change_owner_request");
