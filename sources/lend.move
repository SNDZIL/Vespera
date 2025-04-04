module vespera::lend{
  use aptos_framework::primary_fungible_store;
  use std::signer;
  use aptos_framework::timestamp;
  use aptos_framework::event;
  use aptos_framework::object::{Self, Object};
  use std::option::{Self, Option};
  use std::string;
  use aptos_framework::fungible_asset::{Self, FungibleAsset, Metadata};

  const Admin:address = @0xf87d46de310897a1a34abab457e7ce3395a3e9a7cff4db0e7ca744440a2d7007;
  const ERR_NOTADMIN:u64 = 0;
  const ERR_NOTOVERTIME:u64 = 1;
  const ERR_OVERMAX:u64 = 2;
  const ERR_NOTOWNER:u64 = 3;

  struct Profile has key{
    current: u64,
    max: u64
  }

  struct Lend has key{
    lender: address,
    receiver: address,
    expire: u64,
    amount: u64,
  }

  struct FAConfig has key {
    metadata: Object<Metadata>,
    max_supply: Option<u64>,
  }

  struct FAController has key {
    mint_ref: fungible_asset::MintRef,
    burn_ref: fungible_asset::BurnRef,
    transfer_ref: fungible_asset::TransferRef,
  } 
  
  fun init_module(deployer: &signer){
    let token_metadata = &object::create_named_object(deployer, b"usdy");
    primary_fungible_store::create_primary_store_enabled_fungible_asset(
        token_metadata,
        option::none(),
        string::utf8(b"usdv"),
        string::utf8(b"usdv"),
        6,
        string::utf8(b""),
        string::utf8(b""),
    );
    let fa_obj_signer = &object::generate_signer(token_metadata);
    let fa_obj = object::object_from_constructor_ref(token_metadata);
    let mint_ref = fungible_asset::generate_mint_ref(token_metadata);
    let burn_ref = fungible_asset::generate_burn_ref(token_metadata);
    let transfer_ref = fungible_asset::generate_transfer_ref(token_metadata);
    move_to(fa_obj_signer, FAConfig{
      metadata: fa_obj,
      max_supply: option::none()
    });
    move_to(fa_obj_signer, FAController{
      mint_ref, burn_ref, transfer_ref
    });
  }

  fun get_metadata(config: Object<FAConfig>): Object<Metadata> acquires FAConfig {
      let config_data = borrow_global<FAConfig>(object::object_address(&config));
      config_data.metadata
  }
    
  fun transfer_with_transfer_ref(
      controller: Object<FAController>, 
      from: address,
      to: address, 
      amount: u64
  ) acquires FAController {
      let controller_data = borrow_global<FAController>(object::object_address(&controller));
      primary_fungible_store::transfer_with_ref(&controller_data.transfer_ref, from, to, amount);
  }

  public entry fun mint_token(add: address, obj: Object<FAController>)acquires FAController{
    let fa_controller = borrow_global<FAController>(object::object_address(&obj));
    primary_fungible_store::mint(&fa_controller.mint_ref, add, 1_000_000_000);
  }

  public fun withdraw_usdv(
      owner: &signer,
      amount: u64,
      config: Object<FAConfig>,
  ): FungibleAsset acquires FAConfig {
    let usdv_config = get_metadata(config);
    let store_obj = primary_fungible_store::primary_store(signer::address_of(owner), usdv_config);  
    fungible_asset::withdraw(owner, store_obj, amount)
  }

  public entry fun register(account: &signer){
    let constructor_ref = &object::create_named_object(account, b"vespera");
    let signer_ref = &object::generate_signer(constructor_ref);
    let profile = Profile {
      current: 0,
      max: 0
    };
    move_to(signer_ref, profile);
  }

  public entry fun lendToSeller(account:&signer, seller: address, amount: u64, expireTime: u64,
  config: Object<FAConfig>, profile: Object<Profile>
  ) acquires FAConfig, Profile {
    let profileInfo = borrow_global_mut<Profile>(object::object_address(&profile));
    assert!(object::is_owner(profile, seller), ERR_NOTOWNER);
    assert!(profileInfo.current+amount <= profileInfo.max, ERR_OVERMAX);
    profileInfo.current = profileInfo.current + amount;
    let coins = withdraw_usdv(account, amount, config);
    let usdv_config = get_metadata(config);
    let sellerStore = primary_fungible_store::primary_store(seller, usdv_config);
    fungible_asset::deposit(sellerStore, coins);
    let add = signer::address_of(account);
    let lend = Lend{
      lender: add,
      receiver: seller,
      amount,
      expire: expireTime,
    };
    let constructor_ref = object::create_object(add);
    let signer_ref = &object::generate_signer(&constructor_ref);
    move_to(signer_ref, lend);
  } 

  public entry fun repayToLender(account:&signer, lend: Object<Lend>, amount: u64, 
  config: Object<FAConfig>, profile: Object<Profile>)acquires Lend, FAConfig, Profile{
    let usdv_config = get_metadata(config);
    let lendToPay = borrow_global_mut<Lend>(object::object_address(&lend));
    let profileInfo = borrow_global_mut<Profile>(object::object_address(&profile));
    assert!(object::is_owner(profile, lendToPay.receiver), ERR_NOTOWNER);
    let amountToPay = lendToPay.amount;
    let lender = lendToPay.lender;
    let lenderStore = primary_fungible_store::primary_store(lender, usdv_config);
    if(amountToPay>amount){
      let coins = withdraw_usdv(account, amount, config);
      fungible_asset::deposit(lenderStore, coins);
      lendToPay.amount = amountToPay - amount;
      profileInfo.current = profileInfo.current - amount;
    }else{
      let Lend{lender:_, receiver:_, expire:_, amount:_} = move_from<Lend>(object::object_address(&lend));
      let coins = withdraw_usdv(account, amountToPay, config);
      fungible_asset::deposit(lenderStore, coins);
      profileInfo.current = profileInfo.current - amountToPay;
    }
  }

  public entry fun overTime(lend: Object<Lend>, config: Object<FAConfig>, 
  controller: Object<FAController>, profile: Object<Profile>)
  acquires Lend, FAConfig, FAController, Profile{
    let usdv_config = get_metadata(config);
    let lendToPay = borrow_global_mut<Lend>(object::object_address(&lend));
    let time = lendToPay.expire;
    assert!(object::is_owner(profile, lendToPay.receiver), ERR_NOTOWNER);
    assert!(timestamp::now_seconds() >= time, ERR_NOTOVERTIME);
    let profileInfo = borrow_global_mut<Profile>(object::object_address(&profile));
    let amountToPay = lendToPay.amount;
    let seller = lendToPay.receiver;
    let amount = primary_fungible_store::balance(seller, usdv_config);
    if(amountToPay>amount){
      transfer_with_transfer_ref(controller, seller, lendToPay.lender, amount);
      lendToPay.amount = amountToPay - amount;
      profileInfo.current = profileInfo.current - amount;
    }else{
      transfer_with_transfer_ref(controller, lendToPay.receiver, lendToPay.lender, amountToPay);
      let Lend{lender:_, receiver:_, expire:_, amount:_} = move_from<Lend>(object::object_address(&lend));
      profileInfo.current = profileInfo.current - amountToPay;
    }
  }

  public entry fun changeProfile(account:&signer, profile:Object<Profile>, newmax: u64)acquires Profile{
    assert!(signer::address_of(account) == Admin, ERR_NOTADMIN);
    let profileToChange = borrow_global_mut<Profile>(object::object_address(&profile));
    profileToChange.max = newmax; 
  }

  #[view]
  public fun viewTime(lend: Object<Lend>):u64 acquires Lend{
    let lendInfo = borrow_global<Lend>(object::object_address(&lend));
    lendInfo.expire
  }

  #[view]
  public fun viewMax(profile: Object<Profile>):u64 acquires Profile{
    let profileInfo = borrow_global<Profile>(object::object_address(&profile));
    profileInfo.max
  }

  #[view]
  public fun viewCurrent(profile: Object<Profile>):u64 acquires Profile{
    let profileInfo = borrow_global<Profile>(object::object_address(&profile));
    profileInfo.current
  }
}