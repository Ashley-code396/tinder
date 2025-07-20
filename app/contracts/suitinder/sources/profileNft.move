module suitinder::profileNft;


use sui::table::{Self, Table};
use std::string::String;
use sui::url::Url;
use sui::package::Publisher;




const EProfileAlreadyExists: u64 = 1;



public struct ProfileRegistry has key{
    id: UID,
    publisher: Publisher,
    profiles: Table<address, ID>
    
}

public struct ProfileNFT has key{
    id: UID,
    first_name: String,
    email: String,
    birthday_month: u64,
    birthday_day: u64,
    birthday_year: u64,
    gender: String,
    show_gender: bool,
    interested_in: String,
    relationship_intent: vector<String>,
    interests: vector<String>,
    photos: vector<Url>,
}



public struct PROFILENFT has drop{}

//public struct SUITINDER has drop{}



fun init(otw: PROFILENFT, ctx: &mut TxContext){

    let publisher = sui::package::claim(otw, ctx);

    let profile_registry = ProfileRegistry{
        id: object::new(ctx),
        publisher: publisher,
        profiles: table::new<address, ID>(ctx)
    };

    transfer::share_object(profile_registry);
    
    
}


public fun mint_profile_nft(
    profile_registry: &mut ProfileRegistry,
    first_name: String,
    email: String,
    birthday_month: u64,
    birthday_day: u64,
    birthday_year: u64,
    gender: String,
    show_gender: bool,
    interested_in: String,
    relationship_intent: vector<String>,
    interests: vector<String>,
    photos: vector<Url>,
    ctx: &mut TxContext

){

    assert!(!table::contains(&profile_registry.profiles, ctx.sender()), EProfileAlreadyExists);
            
    let profile_nft = ProfileNFT{
        id: object::new(ctx),
        first_name,
        email,
        birthday_month,
        birthday_day,
        birthday_year,
        gender,
        show_gender,
        interested_in,
        relationship_intent,
        interests,
        photos



    };

    let profile_nft_id = object::id(&profile_nft);
    table::add(&mut profile_registry.profiles, ctx.sender(), profile_nft_id);


    transfer::transfer(profile_nft, ctx.sender());

    

}




