// use dotenv::dotenv;
use llm_chain::{executor, parameters, prompt, step::Step};
// use std::env;

// input: please swap 1 nep to neo gas right now
// output: [quantity, token_in, token_out]
// input: whenever price of neo falls below 10$ swap my neo gas to neo
// output [trigger_amount, token_in, token_out]

#[tokio::main(flavor = "current_thread")]
pub async fn llm_init(input_str: String) -> Result<(), Box<dyn std::error::Error>> {
    // dotenv().ok();
    // let openai_key = env::var("OPENAI_API_KEY").unwrap();
    // Create a new ChatGPT executor
    let exec = executor!()?;
    println!("sending to chatgpt");
    // Create our step containing our prompt template
    let step = Step::for_prompt_template(prompt!(
        "You are a bot which get a string input and parse info values from that and respond an array of values accordingly.",
        r#"here is the two types of array of values you need to return
        there are two types of return values
        1. [type, quantity, token_in, token_out]
        2. [type, trigger_amount, token_in, token_out]

        type: swap or trigger (string)
        quantity: the amount of token to swap (number)
        trigger_amount: the amount of token to swap (number)
        token_in: the token to swap from (string)
        token_out: the token to swap to (string)

        few list of inputs and outputs:
            input: please swap 1 neo to neo gas right now
            return: ["swap", 1, "neo" "neo_gas"]
            input: whenever price of neo falls below 10$ swap my neo gas to neo
            return: ["trigger", 10, "neo_gas" "neo"]
            input: set a trigger to swap 1 neo to neo gas when price of neo falls below 10$
            return: ["trigger", 10, "neo" "neo_gas"]
            input: sell all tokens in my wallet from neo gas to neo
            return: ["swap", 100, "neo_gas" "neo"]
        "#,
    ));

    // Run the step
    println!("sending data for chatgpt {}", input_str);
    let res = step
        .run(
            &parameters!(
                "Return array for this, no other data in your response jut array"
                    .to_owned()
                    .to_owned()
                    + &&input_str.to_string()
            ),
            &exec,
        )
        .await
        .unwrap();
    println!("{}", res);
    println!("got data from chatgpt");

    println!("{}", res.to_immediate().await?.as_content());
    Ok(())
}
