// module vespera::usdv{
//   use std::option::{Self, Option};
//   use std::string;
//   use aptos_framework::fungible_asset::{Self, FungibleAsset, Metadata};
//   use aptos_framework::primary_fungible_store;
//   use aptos_framework::object::{Self, Object};

//   struct FAConfig has key {
//     metadata: Object<Metadata>,
//     max_supply: Option<u64>,
//   }

//   struct FAController has key {
//     mint_ref: fungible_asset::MintRef,
//     burn_ref: fungible_asset::BurnRef,
//     transfer_ref: fungible_asset::TransferRef,
//   } 
  
//   fun init_module(deployer: &signer){
//     let token_metadata = &object::create_named_object(deployer, b"usdy");
//     primary_fungible_store::create_primary_store_enabled_fungible_asset(
//         token_metadata,
//         option::none(),
//         string::utf8(b"usdy"),
//         string::utf8(b"usdy"),
//         6,
//         string::utf8(b""),
//         string::utf8(b""),
//     );
//     let fa_obj_signer = &object::generate_signer(token_metadata);
//     let fa_obj = object::object_from_constructor_ref(token_metadata);
//     let mint_ref = fungible_asset::generate_mint_ref(token_metadata);
//     let burn_ref = fungible_asset::generate_burn_ref(token_metadata);
//     let transfer_ref = fungible_asset::generate_transfer_ref(token_metadata);
//     move_to(fa_obj_signer, FAConfig{
//       metadata: fa_obj,
//       max_supply: option::none()
//     });
//     move_to(fa_obj_signer, FAController{
//       mint_ref, burn_ref, transfer_ref
//     });
//   }

//   public fun get_metadata(config: Object<FAConfig>): Object<Metadata> acquires FAConfig {
//       let config_data = borrow_global<FAConfig>(object::object_address(&config));
//       config_data.metadata
//   }
    
//   fun transfer_with_transfer_ref(
//       controller: Object<FAController>, 
//       from: address,
//       to: address, 
//       amount: u64
//   ) acquires FAController {
//       let controller_data = borrow_global<FAController>(object::object_address(&controller));
//       primary_fungible_store::transfer_with_ref(&controller_data.transfer_ref, from, to, amount);
//   }

//   public entry fun mint_token(add: address, obj: Object<FAController>)acquires FAController{
//     let fa_controller = borrow_global<FAController>(object::object_address(&obj));
//     primary_fungible_store::mint(&fa_controller.mint_ref, add, 1_000_000);
//   }
// }