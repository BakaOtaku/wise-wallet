#![feature(proc_macro_hygiene, decl_macro)]
use gpt_model::llm_init;

#[macro_use]
extern crate rocket;

#[get("/api?<intent_str>&<user_addr>")]
fn intent(intent_str: String, user_addr: String) -> () {
    println!("intent_str: {}", intent_str);
    println!("user_addr: {}", user_addr);
    // catorize the transaction type
    let arr = llm_init(intent_str).unwrap();
    // return parsed values, tx generation doing on client-side for now
    arr
}

#[get("/")]
fn index() -> &'static str {
    "implementation of infra for intent based transactions with AA wallet"
}

#[get("/ping")]
pub fn ping() -> &'static str {
    "PONG!"
}

fn main() {
    rocket::ignite()
        .mount("/", routes![index, intent, ping])
        .launch();
}
