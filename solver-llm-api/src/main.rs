#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;

#[get("/")]
fn index() -> &'static str {
    "implementation of infra for intent based transactions with AA wallet"
}

fn main() {
    rocket::ignite().mount("/", routes![index]).launch();
}