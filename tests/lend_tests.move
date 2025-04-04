#[test_only]
module vespera::lend_tests {
    use std::signer;
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use aptos_framework::object;
    use aptos_framework::fungible_asset::{Self, FungibleAsset, Metadata};
    use aptos_framework::primary_fungible_store;
    use vespera::lend::{Self, FAConfig, FAController, Profile, Lend};
    use std::option;
    use std::string;

    const ADMIN_ADDR: address = @0xf87d46de310897a1a34abab457e7ce3395a3e9a7cff4db0e7ca744440a2d7007;
    const LENDER_ADDR: address = @0x111;
    const BORROWER_ADDR: address = @0x222;

    fun setup_usdv(deployer: &signer): (object::Object<FAConfig>, object::Object<FAController>) {
        let token_metadata = &object::create_named_object(deployer, b"usdy");
        primary_fungible_store::create_primary_store_enabled_fungible_asset(
            token_metadata,
            option::none(),
            string::utf8(b"usdy"),
            string::utf8(b"usdy"),
            6,
            string::utf8(b""),
            string::utf8(b""),
        );
        
        let fa_obj_signer = &object::generate_signer(token_metadata);
        let fa_obj = object::object_from_constructor_ref(token_metadata);
        let mint_ref = fungible_asset::generate_mint_ref(token_metadata);
        let burn_ref = fungible_asset::generate_burn_ref(token_metadata);
        let transfer_ref = fungible_asset::generate_transfer_ref(token_metadata);
        
        move_to(fa_obj_signer, FAConfig {
            metadata: fa_obj,
            max_supply: option::none()
        });
        move_to(fa_obj_signer, FAController {
            mint_ref, 
            burn_ref, 
            transfer_ref
        });
        
        let config_addr = object::object_address(fa_obj);
        let config = object::address_to_object<FAConfig>(config_addr);
        let controller = object::address_to_object<FAController>(config_addr);
        
        (config, controller)
    }

    fun setup_test(
        aptos_framework: &signer,
        admin: &signer,
        lender: &signer,
        borrower: &signer
    ): (object::Object<FAConfig>, object::Object<FAController>) {
        timestamp::set_time_has_started_for_testing(aptos_framework);
      
        if (!account::exists_at(signer::address_of(admin))) {
            account::create_account_for_test(signer::address_of(admin));
        };
        if (!account::exists_at(signer::address_of(lender))) {
            account::create_account_for_test(signer::address_of(lender));
        };
        if (!account::exists_at(signer::address_of(borrower))) {
            account::create_account_for_test(signer::address_of(borrower));
        };
        
        let (config, controller) = setup_usdv(admin);
        
        lend::mint_token(signer::address_of(lender), controller);
        
        (config, controller)
    }

    #[test(admin = @0xf87d46de310897a1a34abab457e7ce3395a3e9a7cff4db0e7ca744440a2d7007, lender = @0x111, borrower = @0x222, aptos_framework = @0x1)]
    fun test_lend_and_repay(admin: &signer, lender: &signer, borrower: &signer, aptos_framework: &signer) {
        let (config, controller) = setup_test(aptos_framework, admin, lender, borrower);
        
        lend::register(borrower);
        
        let profile_addr = object::create_object_address(signer::address_of(borrower), b"vespera");
        let profile = object::address_to_object<Profile>(profile_addr);
        
        lend::changeProfile(admin, profile, 5000);
        
        let max_credit = lend::viewMax(profile);
        assert!(max_credit == 5000, 0);
        
        let borrower_addr = signer::address_of(borrower);
        let lender_addr = signer::address_of(lender);
        
        let metadata = lend::get_metadata(config);
        let lender_balance_before = primary_fungible_store::balance(lender_addr, metadata);
        let borrower_balance_before = primary_fungible_store::balance(borrower_addr, metadata);
        
        let current_time = timestamp::now_seconds();
        let expire_time = current_time + 7 * 24 * 60 * 60; 
        
        let loan_amount = 200000; 
        lend::lendToSeller(lender, borrower_addr, loan_amount, expire_time, config);
        
        let lender_balance_after = primary_fungible_store::balance(lender_addr, metadata);
        let borrower_balance_after = primary_fungible_store::balance(borrower_addr, metadata);
        
        assert!(lender_balance_after == lender_balance_before - loan_amount, 1);
        assert!(borrower_balance_after == borrower_balance_before + loan_amount, 2);
        
        let lend_addr = find_lend_object(lender_addr);
        let lend_obj = object::address_to_object<Lend>(lend_addr);
        
        let repay_amount = 50000;
        lend::mint_token(borrower_addr, controller);
        lend::repayToLender(borrower, lend_obj, repay_amount, config);
        
        let borrower_balance_after_repay = primary_fungible_store::balance(borrower_addr, metadata);
        let lender_balance_after_repay = primary_fungible_store::balance(lender_addr, metadata);
        
        assert!(lender_balance_after_repay > lender_balance_after, 3);
        
        timestamp::fast_forward_seconds(7 * 24 * 60 * 60 + 1);
        lend::overTime(lend_obj, config, controller);
        
        let lender_final_balance = primary_fungible_store::balance(lender_addr, metadata);
        assert!(lender_final_balance > lender_balance_after_repay, 4);
    }
    

    fun find_lend_object(lender_addr: address): address {
        object::create_object_address(lender_addr, x"0000000000000000000000000000000000000000000000000000000000000001")
    }
}