const Cybar = artifacts.require("CybarERC20");
const Dummy = artifacts.require("DummyToken");
const CybarFactory = artifacts.require("CybarFactory");
const CybarPair = artifacts.require("CybarPair");

module.exports = async function(deployer, network, accounts) {
    let walletAddress;
    if( network == "development"){
        walletAddress = accounts[0];
    } else if (network == "fantomTestnet") {
        walletAddress = "0xf469818b50D0d7aFC2dd29050a3d5dc87C645438";
    }

    await deployer.deploy(Cybar);
    const cybar = await Cybar.deployed();
    const cybarAddress = cybar["address"];
    await deployer.deploy(Dummy);
    const dummy = await Dummy.deployed();
    const dummyAddress = dummy["address"];
    
    await deployer.deploy(CybarFactory, walletAddress);
    const cybarFactory = await CybarFactory.deployed();
    let result = await cybarFactory.createPair(cybarAddress, dummyAddress);
    const pairAddress = result.logs[0].args.pair;
    const cybarPair = await CybarPair.at(pairAddress);
    const reserves = await cybarPair.getReserves();

    console.log(reserves);
};

